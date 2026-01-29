"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

export default function Page() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Fetch analytics data
  useEffect(() => {
    api
      .get(`/restaurants/${id}/analytics`)
      .then((res) => setData(res.data))
      .catch(() => setError("Failed to load analytics. Please try again."));
  }, [id]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 text-lg">Loading analytics...</p>
      </div>
    );
  }

  // Convert analytics object to array for charts
  const analyticsArray = data.analytics
    ? Object.entries(data.analytics).map(([date, values]) => ({
        date,
        ...values,
      }))
    : [];

  // Filter by date range
  const filteredAnalytics = analyticsArray.filter((d) => {
    if (!dateRange.start || !dateRange.end) return true;
    const date = new Date(d.date);
    const start = new Date(dateRange.start);
    const end = new Date(dateRange.end);
    return date >= start && date <= end;
  });

  // Separate for charts
  const filteredDailyOrders = filteredAnalytics.map((d) => ({
    date: d.date,
    total_orders: d.total_orders || 0,
  }));

  const filteredDailyRevenue = filteredAnalytics.map((d) => ({
    date: d.date,
    revenue: d.revenue || 0,
  }));

  const peakHours = filteredAnalytics.map((d) => ({
    date: d.date,
    hour: d.peak_hour ?? "-",
    total: d.total_orders ?? 0,
  }));

  const isEmptyData =
    filteredDailyOrders.length === 0 && filteredDailyRevenue.length === 0;

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto space-y-8">
      {/* Date Range Picker */}
      <div className="flex gap-4 items-center">
        <label>
          Start Date:
          <input
            type="date"
            className="ml-2 border rounded px-2 py-1"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            className="ml-2 border rounded px-2 py-1"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
          />
        </label>
      </div>

      {/* Average Order Value */}
      <div className="p-6 bg-white rounded-xl shadow-lg text-center">
        <h2 className="text-2xl font-bold text-orange-600">Avg Order Value</h2>
        <p className="text-3xl mt-2 font-extrabold text-black">
          ₹{data.avg_order_value ?? 0}
        </p>
      </div>

      {/* Daily Orders Line Chart */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-black">Daily Orders</h3>
        {filteredDailyOrders.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredDailyOrders}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="total_orders" stroke="#ff4500" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500">
            No data available for Daily Orders
          </div>
        )}
      </div>

      {/* Daily Revenue Bar Chart */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-black">Daily Revenue</h3>
        {filteredDailyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredDailyRevenue}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#ff4500" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-500">
            No data available for Daily Revenue
          </div>
        )}
      </div>

      {/* Peak Hours */}
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <h3 className="text-xl font-semibold mb-4 text-black">Peak Hours</h3>
        {peakHours.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            {peakHours.map((d, i) => (
              <div key={i} className="p-4 bg-orange-50 rounded-lg">
                <p className="font-semibold text-black">{d.date}</p>
                <p className="text-orange-600">
                  {d.hour}:00 - {d.total} orders
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No peak hours data available
          </p>
        )}
      </div>

      {isEmptyData && (
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600 text-lg">
            No data available for the selected date range.
          </p>
        </div>
      )}
    </div>
  );
}
