<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'order_number', 'customer_name', 'customer_email',
        'customer_phone', 'shipping_address', 'subtotal', 'discount',
        'total', 'status', 'payment_method', 'payment_status',
        'payhere_order_id', 'notes',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public static function generateOrderNumber(): string
    {
        return 'TM-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
    }
}
