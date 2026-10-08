<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@techmart.com',
            'password' => bcrypt('password'),
            'phone' => '0771234567',
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => bcrypt('password'),
            'phone' => '0779876543',
            'role' => 'customer',
        ]);

        $categories = [
            ['name' => 'Smartphones', 'slug' => 'smartphones', 'description' => 'Latest smartphones from top brands', 'image' => 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop'],
            ['name' => 'Laptops', 'slug' => 'laptops', 'description' => 'Powerful laptops for work and play', 'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop'],
            ['name' => 'Tablets', 'slug' => 'tablets', 'description' => 'Tablets for productivity and entertainment', 'image' => 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=300&fit=crop'],
            ['name' => 'Smart Devices', 'slug' => 'smart-devices', 'description' => 'Smart home and wearable devices', 'image' => 'https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400&h=300&fit=crop'],
            ['name' => 'Accessories', 'slug' => 'accessories', 'description' => 'Phone cases, chargers, cables and more', 'image' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400&h=300&fit=crop'],
            ['name' => 'Audio', 'slug' => 'audio', 'description' => 'Headphones, earbuds and speakers', 'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop'],
        ];

        foreach ($categories as $cat) {
            Category::create($cat);
        }

        $products = [
            ['category_id' => 1, 'name' => 'iPhone 15 Pro Max', 'slug' => 'iphone-15-pro-max', 'description' => 'The most powerful iPhone ever with A17 Pro chip, 48MP camera system, and titanium design.', 'price' => 499990, 'sale_price' => 479990, 'stock' => 25, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '6.7" Super Retina XDR', 'Chip' => 'A17 Pro', 'Camera' => '48MP + 12MP + 12MP', 'Battery' => '4422 mAh', 'Storage' => '256GB']],
            ['category_id' => 1, 'name' => 'Samsung Galaxy S24 Ultra', 'slug' => 'samsung-galaxy-s24-ultra', 'description' => 'Galaxy AI-powered smartphone with S Pen, 200MP camera, and Snapdragon 8 Gen 3.', 'price' => 459990, 'stock' => 30, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '6.8" Dynamic AMOLED 2X', 'Chip' => 'Snapdragon 8 Gen 3', 'Camera' => '200MP + 12MP + 50MP + 10MP', 'Battery' => '5000 mAh', 'Storage' => '256GB']],
            ['category_id' => 1, 'name' => 'Google Pixel 8 Pro', 'slug' => 'google-pixel-8-pro', 'description' => 'The best of Google AI with advanced camera features and 7 years of updates.', 'price' => 289990, 'stock' => 20, 'images' => ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '6.7" LTPO OLED', 'Chip' => 'Google Tensor G3', 'Camera' => '50MP + 48MP + 48MP', 'Battery' => '5050 mAh', 'Storage' => '128GB']],
            ['category_id' => 1, 'name' => 'OnePlus 12', 'slug' => 'oneplus-12', 'description' => 'Flagship killer with Snapdragon 8 Gen 3, Hasselblad camera, and 100W fast charging.', 'price' => 229990, 'sale_price' => 209990, 'stock' => 15, 'images' => ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '6.82" LTPO AMOLED', 'Chip' => 'Snapdragon 8 Gen 3', 'Camera' => '50MP + 48MP + 64MP', 'Battery' => '5400 mAh', 'Storage' => '256GB']],
            ['category_id' => 2, 'name' => 'MacBook Pro 14" M3 Pro', 'slug' => 'macbook-pro-14-m3-pro', 'description' => 'Supercharged by M3 Pro chip with up to 18 hours battery life.', 'price' => 749990, 'sale_price' => 699990, 'stock' => 10, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '14.2" Liquid Retina XDR', 'Chip' => 'Apple M3 Pro', 'RAM' => '18GB', 'Storage' => '512GB SSD', 'Battery' => 'Up to 17 hrs']],
            ['category_id' => 2, 'name' => 'Dell XPS 15', 'slug' => 'dell-xps-15', 'description' => 'Premium Windows laptop with InfinityEdge display and 13th Gen Intel Core i7.', 'price' => 549990, 'stock' => 12, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '15.6" OLED 3.5K', 'Processor' => 'Intel Core i7-13700H', 'RAM' => '16GB DDR5', 'Storage' => '512GB SSD', 'GPU' => 'NVIDIA RTX 4050']],
            ['category_id' => 2, 'name' => 'ASUS ROG Strix G16', 'slug' => 'asus-rog-strix-g16', 'description' => 'Gaming laptop with RTX 4070, 165Hz display, and advanced cooling.', 'price' => 629990, 'sale_price' => 589990, 'stock' => 8, 'images' => ['https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '16" QHD+ 165Hz', 'Processor' => 'Intel Core i9-13980HX', 'RAM' => '16GB DDR5', 'Storage' => '1TB SSD', 'GPU' => 'NVIDIA RTX 4070']],
            ['category_id' => 3, 'name' => 'iPad Pro 12.9" M2', 'slug' => 'ipad-pro-12-9-m2', 'description' => 'The ultimate iPad experience with M2 chip and Liquid Retina XDR display.', 'price' => 399990, 'stock' => 15, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '12.9" Liquid Retina XDR', 'Chip' => 'Apple M2', 'Storage' => '256GB', 'Camera' => '12MP + 10MP']],
            ['category_id' => 3, 'name' => 'Samsung Galaxy Tab S9+', 'slug' => 'samsung-galaxy-tab-s9-plus', 'description' => 'Premium Android tablet with S Pen and Dynamic AMOLED 2X display.', 'price' => 299990, 'sale_price' => 274990, 'stock' => 18, 'images' => ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '12.4" Dynamic AMOLED 2X', 'Chip' => 'Snapdragon 8 Gen 2', 'Storage' => '256GB', 'RAM' => '12GB', 'Battery' => '10090 mAh']],
            ['category_id' => 4, 'name' => 'Apple Watch Series 9', 'slug' => 'apple-watch-series-9', 'description' => 'Most powerful Apple Watch with S9 chip and double tap gesture.', 'price' => 129990, 'stock' => 35, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1551816230-ef5deaed4a26?w=600&h=600&fit=crop'], 'specifications' => ['Display' => '45mm OLED', 'Chip' => 'Apple S9', 'Battery' => 'Up to 18 hrs', 'Water Resistance' => '50m']],
            ['category_id' => 4, 'name' => 'Amazon Echo Dot 5th Gen', 'slug' => 'amazon-echo-dot-5th-gen', 'description' => 'Smart speaker with Alexa and improved audio quality.', 'price' => 17990, 'sale_price' => 12990, 'stock' => 50, 'images' => ['https://images.unsplash.com/photo-1512446816042-444d641267d4?w=600&h=600&fit=crop'], 'specifications' => ['Speaker' => '1.73" front-firing', 'Connectivity' => 'Wi-Fi, Bluetooth 5.0', 'Assistant' => 'Alexa']],
            ['category_id' => 5, 'name' => 'Anker 65W USB-C Charger', 'slug' => 'anker-65w-usb-c-charger', 'description' => 'Compact GaN charger with 65W output. Dual USB-C ports.', 'price' => 12990, 'sale_price' => 9990, 'stock' => 60, 'images' => ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop'], 'specifications' => ['Output' => '65W max', 'Ports' => '2x USB-C', 'Technology' => 'GaN II', 'Weight' => '120g']],
            ['category_id' => 5, 'name' => 'Samsung T7 1TB Portable SSD', 'slug' => 'samsung-t7-1tb-ssd', 'description' => 'Fast portable SSD with USB 3.2 speeds up to 1,050 MB/s.', 'price' => 34990, 'stock' => 25, 'images' => ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600&h=600&fit=crop'], 'specifications' => ['Capacity' => '1TB', 'Speed' => 'Up to 1,050 MB/s', 'Interface' => 'USB 3.2 Gen 2', 'Weight' => '58g']],
            ['category_id' => 5, 'name' => 'Logitech MX Master 3S', 'slug' => 'logitech-mx-master-3s', 'description' => 'Premium wireless mouse with 8K DPI sensor and quiet clicks.', 'price' => 29990, 'sale_price' => 24990, 'stock' => 30, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop'], 'specifications' => ['Sensor' => '8000 DPI', 'Battery' => 'Up to 70 days', 'Connectivity' => 'Bluetooth, USB receiver']],
            ['category_id' => 6, 'name' => 'Sony WH-1000XM5', 'slug' => 'sony-wh-1000xm5', 'description' => 'Industry-leading noise cancelling headphones with 30-hour battery.', 'price' => 99990, 'sale_price' => 84990, 'stock' => 20, 'featured' => true, 'images' => ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&h=600&fit=crop'], 'specifications' => ['Driver' => '30mm', 'ANC' => 'Adaptive', 'Battery' => '30 hours', 'Codec' => 'LDAC, AAC, SBC']],
            ['category_id' => 6, 'name' => 'Apple AirPods Pro 2', 'slug' => 'apple-airpods-pro-2', 'description' => 'Active noise cancellation and personalized spatial audio with H2 chip.', 'price' => 84990, 'stock' => 40, 'images' => ['https://images.unsplash.com/photo-1588423771073-b8903fbd3236?w=600&h=600&fit=crop'], 'specifications' => ['Chip' => 'Apple H2', 'ANC' => '2x more effective', 'Battery' => '6 hrs (30 hrs with case)', 'Water Resistance' => 'IPX4']],
            ['category_id' => 6, 'name' => 'JBL Charge 5', 'slug' => 'jbl-charge-5', 'description' => 'Powerful portable Bluetooth speaker with 20 hours playtime and IP67.', 'price' => 49990, 'sale_price' => 42990, 'stock' => 25, 'images' => ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop'], 'specifications' => ['Output' => '30W', 'Battery' => '20 hours', 'Water Resistance' => 'IP67', 'Bluetooth' => '5.1']],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
