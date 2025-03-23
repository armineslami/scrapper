"use client";

import SearchForm from "@/app/(root)/components/SearchForm";
import Car from "@/interface/Car";
import HomeProps from "@/interface/props/HomeProps";
import React, { useState } from "react";
import CarCard from "./components/DataCard";

const Home: React.FC<HomeProps> = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query: string, numberOfScrolls: number) => {
    setCars([]);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, numberOfScrolls }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "خطای نامشخص رخ داده است");
      }

      setCars(data.cars);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-2 lg:p-8">
      <div className="flex flex-col items-center mt-8">
        <SearchForm
          onSearch={(query: string, numberOfScrolls: number) =>
            handleSearch(query, numberOfScrolls)
          }
        />

        {loading && (
          <div className="space-y-8 mt-16">
            <div className="flex justify-center">
              <div className="w-8 h-8 border-4 border-gray-300 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-sm">در حال دریافت اطلاعات ...</p>
          </div>
        )}

        {error && (
          <div className="w-full flex justify-center text-center mt-16">
            <p className="text-md text-red-500">{error}</p>
          </div>
        )}

        {cars.length < 0 && (
          <div className="w-full flex justify-center text-center">
            <div className="mt-24 space-y-8">
              <p className="text-2xl font-bold">اطلاعاتی یافت نشد</p>
            </div>
          </div>
        )}

        {cars.length > 0 && (
          <div className="mt-16">
            <p className="text-lg font-bold mb-8 text-center">
              نتایج دریافت شده
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 5xl:grid-cols-2 gap-4 ">
              {cars.map((car, index) => {
                return <CarCard key={index} car={car} />;
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
