"use client";

import SearchForm from "@/app/(root)/components/SearchForm";
import Car from "@/interface/Car";
import HomeProps from "@/interface/props/HomeProps";
import React, { useEffect, useState } from "react";
import CarCard from "./components/DataCard";
import { useRouter } from "next/navigation";

const Home: React.FC<HomeProps> = () => {
  const router = useRouter();
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (
    query: string,
    numberOfScrolls: number,
    openLinks: boolean
  ) => {
    setCars([]);
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, numberOfScrolls, openLinks }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "خطای نامشخص رخ داده است");
      }

      setCars(data.cars);
      localStorage.setItem("cars", JSON.stringify(data.cars));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = (id: string) => {
    const car = cars.find((car) => (car.id = id));
    if (car) {
      router.push(`/car/${id}`);
    }
  };

  const reset = () => {
    localStorage.removeItem("cars");
    setCars([]);
  };

  useEffect(() => {
    const cars = localStorage.getItem("cars");
    if (cars) {
      setCars(JSON.parse(cars));
    }
  }, []);

  return (
    <main>
      <div className="flex flex-col items-center mt-8">
        <SearchForm
          onSearch={(
            query: string,
            numberOfScrolls: number,
            openLinks: boolean
          ) => handleSearch(query, numberOfScrolls, openLinks)}
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
            {cars.length > 0 && (
              <div className="text-center">
                <button
                  className="button !bg-red-500 !text-white mb-8"
                  onClick={reset}
                >
                  حذف نتایج
                </button>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 5xl:grid-cols-2 gap-4 ">
              {cars.map((car, index) => {
                return <CarCard key={index} car={car} onClick={onCardClick} />;
              })}
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
