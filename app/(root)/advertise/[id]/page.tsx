/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DivarAdvertise from "@/interface/DivarAdvertise";
import { Camera } from "lucide-react";

const Page = () => {
  const params = useParams();
  const id = params.id as string | undefined;

  const [divarAdvertise, setDivarAdvertise] = useState<DivarAdvertise | null>(
    null
  );

  useEffect(() => {
    if (!id) return;

    // Load advertises from storage
    const stringDivarAdvertise = localStorage.getItem("advertises");
    if (!stringDivarAdvertise) return;

    const advertises: DivarAdvertise[] = JSON.parse(stringDivarAdvertise);
    const foundAdvertise = advertises.find((advertise) => advertise.id == id);

    if (foundAdvertise) {
      setDivarAdvertise(foundAdvertise);
    }
  }, [id]);

  if (!divarAdvertise) return <p>آگهی یافت نشد</p>;

  return (
    <div className="grid grid-cols-12 py-4">
      <div className="col-span-6 px-8">
        <p className="font-bold text-2xl">{divarAdvertise.title}</p>
        <hr className="border border-gray-300 dark:border-gray-600 mt-4" />
        <div className="my-16">
          {divarAdvertise.details &&
            divarAdvertise.details.map((detail, i) => {
              return (
                <div key={i}>
                  <div className="flex flex-row justify-between p-2">
                    <p className="text-md text-gray-600 dark:text-gray-400">
                      {detail.title}
                    </p>
                    <p className="text-md font-bold">{detail.value}</p>
                  </div>
                  {i < divarAdvertise.details!.length - 1 && (
                    <hr className="border border-gray-300 dark:border-gray-600" />
                  )}
                </div>
              );
            })}
        </div>
        <p>{divarAdvertise.description}</p>
      </div>
      <div className="col-span-6 flex justify-end max-h-[400px]">
        {divarAdvertise.image ? (
          <div className="relative w-full max-w-full aspect-w-4 aspect-h-3">
            <img
              src={divarAdvertise.image}
              className="rounded-lg object-cover w-full h-full"
              alt=""
            />
          </div>
        ) : (
          <div className="min-h-[400px] w-full h-full ms-4 bg-gray-300 flex items-center rounded-lg justify-center text-gray-500">
            <Camera size={34} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
