// /Applications/XAMPP/xamppfiles/htdocs/KitchenSpur/frontend/app/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/restaurants"); // redirect to restaurants page
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans">
      <p className="text-gray-600 text-lg">Redirecting to restaurants...</p>
    </div>
  );
}
