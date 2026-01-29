<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Order;
use App\Models\Restaurant;
use Carbon\Carbon;

class AnalyticsController extends Controller {

    public function restaurantAnalytics(Request $req, $id) {
        // Determine date range
        $start = $req->start_date 
            ? Carbon::parse($req->start_date)->startOfDay() 
            : Order::where('restaurant_id', $id)->min('order_time');

        $end = $req->end_date 
            ? Carbon::parse($req->end_date)->endOfDay() 
            : Order::where('restaurant_id', $id)->max('order_time');

        // Base query for orders in range
        $base = Order::where('restaurant_id', $id)
            ->whereBetween('order_time', [$start, $end]);

        // Daily orders
        $dailyOrders = (clone $base)
            ->selectRaw('DATE(order_time) as date, COUNT(*) as total_orders')
            ->groupBy('date')
            ->get();

        // Daily revenue
        $dailyRevenue = (clone $base)
            ->selectRaw('DATE(order_time) as date, SUM(order_amount) as revenue')
            ->groupBy('date')
            ->get();

        // Peak hour per day
        $peakHours = (clone $base)
            ->selectRaw('DATE(order_time) as date, HOUR(order_time) as hour, COUNT(*) as total')
            ->groupBy('date', 'hour')
            ->orderByDesc('total')
            ->get()
            ->groupBy('date')
            ->map(fn($d) => $d->first()); // get the hour with max orders per day

        // Merge daily stats into a single array
        $analytics = $dailyOrders->mapWithKeys(function($d) use ($dailyRevenue, $peakHours) {
            $date = $d->date;
            $revenue = $dailyRevenue->firstWhere('date', $date)->revenue ?? 0;
            $peakHour = $peakHours[$date]->hour ?? null;

            return [$date => [
                'total_orders' => $d->total_orders,
                'revenue' => $revenue,
                'peak_hour' => $peakHour
            ]];
        });

        // Average order value across the range
        $avgOrderValue = round($base->avg('order_amount'), 2);

        return response()->json([
            'analytics' => $analytics,
            'avg_order_value' => $avgOrderValue
        ]);
    }

        public function topRestaurants(Request $req) {

        $range = $req->range ?? 'all';

        $start = null;
        $end = now()->endOfDay();

        if ($range === 'week') {
            $start = now()->startOfWeek();
        } elseif ($range === 'month') {
            $start = now()->startOfMonth();
        }

        $query = Restaurant::join('orders', 'orders.restaurant_id', '=', 'restaurants.id');

        if ($start) {
            $query->whereBetween('orders.order_time', [$start, $end]);
        }

        return $query
            ->groupBy('restaurants.id', 'restaurants.name')
            ->selectRaw('
                restaurants.id,
                restaurants.name,
                SUM(orders.order_amount) AS total_revenue
            ')
            ->orderByDesc('total_revenue')
            ->limit(3)
            ->get();
    }


}
