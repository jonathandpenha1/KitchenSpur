<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Restaurant extends Model
{
    protected $fillable = ['name', 'city', 'cuisine', 'rating'];

    public function orders()
    {
        return $this->hasMany(Order::class, 'restaurant_id', 'id');
    }
}
