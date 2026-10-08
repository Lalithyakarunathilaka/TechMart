<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'customer_phone' => 'required|string|max:20',
            'shipping_address' => 'required|string|max:500',
            'payment_method' => 'required|in:payhere,whatsapp',
            'notes' => 'nullable|string|max:500',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $subtotal = 0;
            $orderItems = [];

            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->stock < $item['quantity']) {
                    return response()->json([
                        'message' => "Insufficient stock for {$product->name}. Available: {$product->stock}",
                    ], 422);
                }

                $price = $product->sale_price ?? $product->price;
                $subtotal += $price * $item['quantity'];

                $orderItems[] = [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'price' => $price,
                    'quantity' => $item['quantity'],
                ];

                $product->decrement('stock', $item['quantity']);
            }

            $order = Order::create([
                'user_id' => $request->user()?->id,
                'order_number' => Order::generateOrderNumber(),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'payment_method' => $validated['payment_method'],
                'payment_status' => $validated['payment_method'] === 'whatsapp' ? 'pending' : 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItems as $item) {
                $order->items()->create($item);
            }

            $order->load('items');

            $response = ['order' => $order];

            if ($validated['payment_method'] === 'payhere') {
                $response['payhere'] = $this->generatePayhereData($order);
            }

            return response()->json($response, 201);
        });
    }

    private function generatePayhereData(Order $order): array
    {
        $merchantId = config('services.payhere.merchant_id');
        $merchantSecret = config('services.payhere.merchant_secret');
        $orderId = $order->order_number;
        $amount = number_format($order->total, 2, '.', '');
        $currency = 'LKR';

        $hash = strtoupper(
            md5(
                $merchantId .
                $orderId .
                $amount .
                $currency .
                strtoupper(md5($merchantSecret))
            )
        );

        return [
            'sandbox' => config('services.payhere.sandbox', true),
            'merchant_id' => $merchantId,
            'return_url' => config('app.frontend_url') . '/order-success?order=' . $orderId,
            'cancel_url' => config('app.frontend_url') . '/checkout',
            'notify_url' => config('app.url') . '/api/payhere/notify',
            'order_id' => $orderId,
            'items' => 'TechMart Order #' . $orderId,
            'currency' => $currency,
            'amount' => $amount,
            'first_name' => explode(' ', $order->customer_name)[0],
            'last_name' => explode(' ', $order->customer_name, 2)[1] ?? '',
            'email' => $order->customer_email,
            'phone' => $order->customer_phone,
            'address' => $order->shipping_address,
            'city' => 'Colombo',
            'country' => 'Sri Lanka',
            'hash' => $hash,
        ];
    }

    public function payhereNotify(Request $request)
    {
        $merchantId = config('services.payhere.merchant_id');
        $merchantSecret = config('services.payhere.merchant_secret');
        $orderId = $request->input('order_id');
        $payhereAmount = $request->input('payhere_amount');
        $payhereCurrency = $request->input('payhere_currency');
        $statusCode = $request->input('status_code');
        $md5sig = $request->input('md5sig');

        $localSig = strtoupper(
            md5(
                $merchantId .
                $orderId .
                $payhereAmount .
                $payhereCurrency .
                $statusCode .
                strtoupper(md5($merchantSecret))
            )
        );

        if ($localSig !== $md5sig) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $order = Order::where('order_number', $orderId)->first();
        if (!$order) {
            return response()->json(['message' => 'Order not found'], 404);
        }

        if ($statusCode == 2) {
            $order->update([
                'payment_status' => 'paid',
                'status' => 'processing',
                'payhere_order_id' => $request->input('payment_id'),
            ]);
        } else {
            $order->update(['payment_status' => 'failed']);
        }

        return response()->json(['message' => 'OK']);
    }

    public function ordersByUser(Request $request)
    {
        $orders = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($orders);
    }

    public function showOrder(Request $request, $id)
    {
        $order = Order::with('items')
            ->where('user_id', $request->user()->id)
            ->findOrFail($id);

        return response()->json($order);
    }
}
