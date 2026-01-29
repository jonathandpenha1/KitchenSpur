"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";

export default function Page() {
  const [restaurants, setRestaurants] = useState([]);
  const [topMap, setTopMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([
      api.get("/restaurants"),
      api.get("/analytics/top-restaurants"),
    ])
      .then(([restaurantsRes, topRes]) => {
        const allRestaurants = restaurantsRes.data.data.data || [];

        // Build ranking map
        const ranking = {};
        topRes.data.forEach((r, index) => {
          ranking[r.id] = {
            rank: index + 1,
            revenue: r.total_revenue,
          };
        });

        // Sort restaurants: top ranked first
        allRestaurants.sort((a, b) => {
          if (ranking[a.id] && ranking[b.id]) {
            return ranking[a.id].rank - ranking[b.id].rank;
          }
          if (ranking[a.id]) return -1;
          if (ranking[b.id]) return 1;
          return 0;
        });

        setTopMap(ranking);
        setRestaurants(allRestaurants);
      })
      .catch(() => setError("Failed to load restaurants. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const badge = (rank) => {
    if (rank === 1) return "👑 Top";
    if (rank === 2) return "🥈 Top";
    if (rank === 3) return "🥉 Top";
    return null;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="spinner mb-4"></div>
        <p className="text-gray-600 text-lg">Loading restaurants...</p>
      </div>
    );
  }

  if (!restaurants.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">No restaurants found.</p>
      </div>
    );
  }

  return (
    <div className="px-6 py-6">
      {/* Top Restaurants CTA */}
      <div className="flex justify-center mb-6">
        <Link
          href="/top-restaurants"
          className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition"
        >
          👑 View Top Restaurants
        </Link>
      </div>

      {/* Restaurants Grid */}
      <div className="restaurant-page flex flex-wrap justify-center gap-6">
        {restaurants.map((r) => {
          const top = topMap[r.id];

          return (
            <div
              key={r.id}
              className={`relative p-6 max-w-sm bg-white rounded-xl shadow-lg text-center space-y-3 transition
                ${top?.rank === 1 ? "ring-4 ring-yellow-400 animate-pulse" : ""}
              `}
            >
              {top && (
                <span className="absolute top-3 right-3 bg-yellow-400 text-white px-3 py-1 rounded-full font-bold text-sm">
                  {badge(top.rank)}
                </span>
              )}

              <h2 className="text-2xl font-bold text-orange-600">{r.name}</h2>

              <p className="text-gray-600">
                <b>City:</b> {r.city}
              </p>

              <p className="text-gray-600">
                <b>Cuisine:</b> {r.cuisine}
              </p>

              <p className="text-yellow-500 text-lg">
                <b>Rating:</b>{" "}
                {r.rating ? "⭐".repeat(Math.round(r.rating)) : "☆☆☆☆☆"}
              </p>

              {top && (
                <p className="text-green-600 font-semibold">
                  ₹{top.revenue.toLocaleString()} revenue
                </p>
              )}

              <Link
                href={`/restaurants/${r.id}`}
                className="inline-block mt-3 px-5 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700"
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
