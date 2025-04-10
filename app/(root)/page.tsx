"use client";

import SearchForm from "@/app/(root)/components/SearchForm";
import HomeProps from "@/interface/props/HomeProps";
import React, { useEffect, useState } from "react";
import AdvertiseCard from "./components/AdvertiseCard";
import { useRouter } from "next/navigation";
import {
  devLog,
  readFromDatabase,
  storeToDatabase,
  truncateDatabase,
} from "@/lib/utils";
import DivarScrapResult from "@/interface/DivarScrapResult";
import DivarAdvertise from "@/interface/DivarAdvertise";

const Home: React.FC<HomeProps> = () => {
  const router = useRouter();
  const [divarAdvertises, setDivarAdvertises] = useState<DivarScrapResult[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (
    queries: string[],
    numberOfScrolls: number,
    openLinks: boolean
  ) => {
    setDivarAdvertises([]);
    setLoading(true);
    setError("");
    truncateDatabase();

    try {
      const response = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ queries, numberOfScrolls, openLinks }),
      });

      const data = await response.json();
      devLog("Scrapping result", data);

      if (!response.ok) {
        throw new Error(data.error || "خطای نامشخص رخ داده است");
      }

      setDivarAdvertises(data.result);
      storeToDatabase(JSON.stringify(data.result));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const onCardClick = (divarAdvertise: DivarAdvertise) => {
    console.log("onCardClick", divarAdvertise);
    if (divarAdvertise) {
      router.push(`/advertise/${divarAdvertise.id}`);
    }
  };

  const reset = () => {
    truncateDatabase();
    setDivarAdvertises([]);
  };

  useEffect(() => {
    const advertises = readFromDatabase();
    if (advertises) {
      setDivarAdvertises(advertises);
    }
  }, []);

  return (
    <main>
      <div className="flex flex-col items-center mt-8">
        <SearchForm
          onSearch={(
            queries: string[],
            numberOfScrolls: number,
            openLinks: boolean
          ) => handleSearch(queries, numberOfScrolls, openLinks)}
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

        {divarAdvertises.length < 0 && (
          <div className="w-full flex justify-center text-center">
            <div className="mt-24 space-y-8">
              <p className="text-2xl font-bold">اطلاعاتی یافت نشد</p>
            </div>
          </div>
        )}

        {divarAdvertises.length > 0 && (
          <div className="mt-16">
            <p className="text-lg font-bold mb-8 text-center">
              نتایج دریافت شده
            </p>
            {divarAdvertises.length > 0 && (
              <div className="text-center">
                <button
                  className="button !bg-red-500 !text-white mb-8"
                  onClick={reset}
                >
                  حذف نتایج
                </button>
              </div>
            )}

            {divarAdvertises.map((advertise, index) => {
              return (
                <div key={index} className="my-8">
                  <p className="my-4">{advertise.query}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 5xl:grid-cols-2 gap-4">
                    {advertise.advertises.map((ad, adIndex) => (
                      <div key={adIndex}>
                        <AdvertiseCard
                          divarAdvertise={ad}
                          onClick={onCardClick}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default Home;
