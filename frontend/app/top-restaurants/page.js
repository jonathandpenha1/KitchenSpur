"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page() {
  const [restaurants, setRestaurants] = useState([]);
  const [topRestaurants, setTopRestaurants] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Fetch all restaurants
    api.get("/restaurants").then(res => {
      setRestaurants(res.data.data.data || []);
    });

    // Fetch top restaurants (all time)
    api.get("/analytics/top-restaurants").then(res => {
      const ranked = {};
      res.data.forEach((r, index) => {
        ranked[r.id] = {
          rank: index + 1,
          revenue: r.total_revenue,
        };
      });
      setTopRestaurants(ranked);
    });
  }, []);

  if (restaurants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 text-lg">Loading restaurants...</p>
      </div>
    );
  }

  const getBadge = (rank) => {
    if (rank === 1) return "🥇 Top 1";
    if (rank === 2) return "🥈 Top 2";
    if (rank === 3) return "🥉 Top 3";
    return null;
  };

  return (
    <div className="px-4 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          ← Back
        </button>
      </div>

      {/* Restaurants Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {restaurants.map((r) => {
          const topInfo = topRestaurants[r.id];

          return (
            <div
              key={r.id}
              className="p-6 bg-white rounded-xl shadow-lg relative hover:shadow-xl transition-shadow"
            >
              {topInfo && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {getBadge(topInfo.rank)}
                </span>
              )}

              <h2 className="text-2xl font-extrabold text-orange-600 mb-2">
                {r.name}
              </h2>

              <p className="text-gray-600">
                <strong>City:</strong> {r.city}
              </p>
              <p className="text-gray-600">
                <strong>Cuisine:</strong> {r.cuisine}
              </p>
              <p className="text-yellow-500">
                <strong>Rating:</strong>{" "}
                {"⭐".repeat(Math.round(r.rating || 0))}
              </p>

              {topInfo && (
                <p className="mt-2 text-sm text-green-600 font-semibold">
                  ₹{topInfo.revenue.toLocaleString()} revenue
                </p>
              )}

              <Link
                href={`/restaurants/${r.id}`}
                className="inline-block mt-4 px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-colors"
              >
                View Details
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
