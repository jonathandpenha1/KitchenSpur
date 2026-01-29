<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Restaurant;

class RestaurantController extends Controller
{
    public function index(Request $request)
    {
        $query = Restaurant::query();

        if ($request->search) {
            $query->where('name', 'like', "%{$request->search}%");
        }

        if ($request->cuisine) {
            $query->where('cuisine', $request->cuisine);
        }

        if ($request->sort === 'rating_desc') {
            $query->orderByDesc('rating');
        }

        $restaurants = $query->paginate(10);

        return response()->json([
            'data' => $restaurants
        ]);
    }

    // RestaurantController
    public function show($id)
    {
        $restaurant = Restaurant::with('orders')->findOrFail($id);
        return response()->json($restaurant);
    }

    public function orders($id, Request $request)
    {
        $perPage = 5; // orders per page
        $restaurant = Restaurant::findOrFail($id);

        // Start building the query
        $query = $restaurant->orders();

        // 1️⃣ Filter by date range
        if ($request->start_date && $request->end_date) {
            $start = \Carbon\Carbon::parse($request->start_date)->startOfDay();
            $end = \Carbon\Carbon::parse($request->end_date)->endOfDay();
            $query->whereBetween('order_time', [$start, $end]);
        }

        // 2️⃣ Filter by amount range
        if ($request->min_amount && $request->max_amount) {
            $query->whereBetween('order_amount', [$request->min_amount, $request->max_amount]);
        } elseif ($request->min_amount) {
            $query->where('order_amount', '>=', $request->min_amount);
        } elseif ($request->max_amount) {
            $query->where('order_amount', '<=', $request->max_amount);
        }

        // 3️⃣ Filter by hour range (time of day)
        if ($request->start_hour !== null && $request->end_hour !== null) {
            $query->whereRaw('HOUR(order_time) BETWEEN ? AND ?', [$request->start_hour, $request->end_hour]);
        }

        // Order by ID ascending
        $query->orderBy('id', 'asc');

        // Paginate
        $orders = $query->paginate($perPage);

        return response()->json($orders);
    }


}
