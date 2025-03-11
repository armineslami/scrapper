"use client";

import React, { useState } from "react";
import SearchFormReset from "./SearchFormReset";
import Car from "@/interface/Car";
import DataCard from "./DataCard";

const SearchForm: React.FC = () => {
  const [query, setQuery] = useState("");
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unknown error occurred");

      setCars(data.cars);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-form-input-container">
          <input
            name="query"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="لینک مورد نظر را وارد کنید"
            className="search-form-input"
          />

          <div className="flex gap-2">
            {query && <SearchFormReset onResetClick={() => setQuery("")} />}
          </div>
        </div>

        <button type="submit" className="button">
          شروع
        </button>
      </form>

      {loading && (
        <p className="mt-16 text-lg font-bold">در حال دریافت اطلاعات ...</p>
      )}

      {error && (
        <div className="w-full flex justify-center text-center">
          <div className="mt-24 space-y-8">
            <p className="text-2xl font-bold">اطلاعاتی یافت نشد</p>
            <button className="button" onClick={handleSearch}>
              مجدد تلاش کنید
            </button>
          </div>
        </div>
      )}

      {cars.length > 0 && (
        <div className="mt-16">
          <p className="text-lg font-bold mb-8 text-center">نتایج دریافت شده</p>
          <div className="grid grid-cols-1 lg:grid-cols-4 5xl:grid-cols-2 gap-4 ">
            {cars.map((car, index) => {
              return <DataCard key={index} car={car} />;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchForm;
