"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function StaffPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/about");
  }, [router]);

  return (
    <div className="pt-32 min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
      <p className="font-nav text-xs font-bold uppercase tracking-wider text-gray-500">
        Redirecting to About Us...
      </p>
    </div>
  );
}
