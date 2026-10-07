<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id', 'name', 'slug', 'description', 'price',
        'sale_price', 'stock', 'images', 'specifications', 'featured', 'status',
    ];

    protected function casts(): array
    {
        return [
            'images' => 'array',
            'specifications' => 'array',
            'featured' => 'boolean',
            'price' => 'decimal:2',
            'sale_price' => 'decimal:2',
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function getEffectivePriceAttribute(): float
    {
        return $this->sale_price ?? $this->price;
    }
}
