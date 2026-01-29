"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/services/api";

export default function Page() {
  const { id } = useParams();

  // Restaurant state
  const [restaurant, setRestaurant] = useState(null);
  const [error, setError] = useState(null);

  // Orders pagination state
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Filters
  const [filters, setFilters] = useState({
    start_date: "",
    end_date: "",
    min_amount: "",
    max_amount: "",
    start_hour: "",
    end_hour: "",
  });

  // Fetch restaurant details
  useEffect(() => {
    api
      .get(`/restaurants/${id}`)
      .then((res) => setRestaurant(res.data))
      .catch(() =>
        setError("Failed to load restaurant data. Please try again.")
      );
  }, [id]);

  // Fetch paginated orders with filters
  const fetchOrders = () => {
    setLoadingOrders(true);

    api
      .get(`/restaurants/${id}/orders`, {
        params: { page, ...filters },
      })
      .then((res) => {
        setOrders(res.data.data);
        setLastPage(res.data.last_page);
      })
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [id, page, filters]);

  // Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters (reset to first page)
  const applyFilters = () => {
    setPage(1);
    fetchOrders();
  };

  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold text-black">{error}</p>
      </div>
    );

  if (!restaurant)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 text-lg">Loading restaurant data...</p>
      </div>
    );

  return (
    <div className="restaurant-page px-6 py-8 space-y-10">
      {/* Restaurant Card */}
      <div className="restaurant-card p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-orange-600">
          {restaurant.name}
        </h1>

        <p className="text-gray-600 text-lg">
          <span className="font-semibold text-gray-800">City:</span>{" "}
          {restaurant.city}
        </p>

        <p className="text-gray-600 text-lg">
          <span className="font-semibold text-gray-800">Cuisine:</span>{" "}
          {restaurant.cuisine}
        </p>

        <p className="text-yellow-500 text-xl">
          <span className="font-semibold text-gray-800">Rating:</span>{" "}
          {restaurant.rating
            ? "⭐".repeat(Math.round(restaurant.rating))
            : "☆☆☆☆☆"}
        </p>

        <a
          href={`/restaurants/${id}/analytics`}
          className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
        >
          View Analytics
        </a>
      </div>

      {/* Orders Section */}
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
        <h2 className="text-2xl font-bold text-orange-600">Orders</h2>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-end mb-4">
          <label className="flex flex-col text-black">
            Start Date
            <input
              type="date"
              name="start_date"
              value={filters.start_date}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            />
          </label>

          <label className="flex flex-col text-black">
            End Date
            <input
              type="date"
              name="end_date"
              value={filters.end_date}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
            />
          </label>

          <label className="flex flex-col text-black">
            Min Amount
            <input
              type="number"
              name="min_amount"
              value={filters.min_amount}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1 w-20 text-sm"
              placeholder="₹"
            />
          </label>

          <label className="flex flex-col text-black">
            Max Amount
            <input
              type="number"
              name="max_amount"
              value={filters.max_amount}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1 w-20 text-sm"
              placeholder="₹"
            />
          </label>

          <label className="flex flex-col text-black">
            Start Hour
            <input
              type="number"
              name="start_hour"
              min="0"
              max="23"
              value={filters.start_hour}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
              placeholder="0-23"
            />
          </label>

          <label className="flex flex-col text-black">
            End Hour
            <input
              type="number"
              name="end_hour"
              min="0"
              max="23"
              value={filters.end_hour}
              onChange={handleFilterChange}
              className="border rounded px-2 py-1"
              placeholder="0-23"
            />
          </label>

          <button
            type="button"
            onClick={applyFilters}
            className="bg-orange-500 text-white px-4 py-2 rounded"
          >
            Apply Filters
          </button>
        </div>

        {loadingOrders ? (
          <p className="text-center text-gray-500">Loading orders...</p>
        ) : orders.length === 0 ? (
          <p className="text-center text-gray-500">
            No orders found for this restaurant.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="p-3 text-black">Order ID</th>
                    <th className="p-3 text-black">Amount</th>
                    <th className="p-3 text-black">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-t hover:bg-gray-50">
                      <td className="p-3 text-black">#{order.id}</td>
                      <td className="p-3 text-green-600 font-semibold text-black">
                        ₹{Number(order.order_amount).toLocaleString()}
                      </td>
                      <td className="p-3 text-black">
                        {new Date(order.order_time).toLocaleDateString()}{" "}
                        {new Date(order.order_time).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-black"
              >
                ← Prev
              </button>

              <span className="text-sm text-gray-600 text-black">
                Page {page} of {lastPage}
              </span>

              <button
                type="button"
                disabled={page === lastPage}
                onClick={() => setPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 text-black"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
