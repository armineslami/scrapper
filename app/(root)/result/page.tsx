import ResultProps from "@/interface/props/ResultProps";
import ScrapeType from "@/interface/ScrapeType";
import Scrapper from "@/lib/Scrapper";
import Image from "next/image";
import React from "react";

const Page: React.FC<ResultProps> = async ({ searchParams }) => {
  const query = (await searchParams).query;

  let cars = null;
  let loading = true;

  if (query) {
    const scrapper = new Scrapper();
    const loaded = await scrapper.load(query);
    if (loaded) {
      cars = scrapper.start(ScrapeType.Divar);
      console.log(cars);
    }
    loading = false;
  }

  return (
    <div>
      {loading ? (
        <div className="w-full bg-red-300 flex justify-center text-center">
          <div className="mt-24 space-y-8">
            <p className="text-2xl font-bold">در حال دریافت اطلاعات ...</p>
          </div>
        </div>
      ) : !cars ? (
        <div className="w-full bg-red-300 flex justify-center text-center">
          <div className="mt-24 space-y-8">
            <p className="text-2xl font-bold">اطلاعاتی یافت نشد</p>
            <p className="text-md">مجدد تلاش کنید</p>
          </div>
        </div>
      ) : (
        <>
          <p className="text-lg font-bold mb-8">نتایج دریافت شده:</p>
          <div className="grid grid-cols-12 gap-4 ">
            {cars.map((car, index) => {
              return (
                <div
                  key={index}
                  className="col-span-4 flex flex-row border border-gray-400 rounded-md"
                >
                  <div>
                    {car.img && (
                      <Image
                        src={car.img}
                        alt={car.title}
                        width={200}
                        height={200}
                      />
                    )}
                  </div>
                  <div className="p-8 space-y-2">
                    <p className="text-lg font-bold">{car.title}</p>
                    <p className="text-md">{car.milage}</p>
                    <p className="text-md">{car.price}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Page;
