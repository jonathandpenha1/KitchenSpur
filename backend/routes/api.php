<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RestaurantController;
use App\Http\Controllers\AnalyticsController;

Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}/orders', [RestaurantController::class, 'orders']);
Route::get('/restaurants/{id}', [RestaurantController::class, 'show']);

Route::get('/restaurants/{id}/analytics', [AnalyticsController::class, 'restaurantAnalytics']);
Route::get('/analytics/top-restaurants', [AnalyticsController::class, 'topRestaurants']);

Route::get('/test', function () {
    return response()->json(['message' => 'API works']);
});

// Root route now returns restaurants
Route::get('/', [RestaurantController::class, 'index']);
