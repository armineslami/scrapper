"use client";

import SearchForm from "@/app/(root)/components/SearchForm";
import Car from "@/interface/Car";
import HomeProps from "@/interface/props/HomeProps";
import React, { useState } from "react";
import CarCard from "./components/DataCard";

const Home: React.FC<HomeProps> = () => {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
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
    <main className="p-8">
      <div className="flex flex-col items-center mt-8">
        <SearchForm
          onQueryChange={setQuery}
          onSearch={() => handleSearch(query)}
        />

        {loading && (
          <p className="mt-16 text-lg font-bold">در حال دریافت اطلاعات ...</p>
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
