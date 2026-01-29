<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Restaurant;
use App\Models\Order;

class DataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $restaurants = json_decode(file_get_contents(storage_path('app/data/restaurants.json')), true);
        foreach ($restaurants as $r) Restaurant::create($r);

        $orders = json_decode(file_get_contents(storage_path('app/data/orders.json')), true);
        foreach ($orders as $o) Order::create($o);
    }
}
