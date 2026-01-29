<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;

Route::get('/', [RestaurantController::class, 'index']); // Use your controller
Route::get('/restaurants', [RestaurantController::class, 'index']); // optional duplicate route
