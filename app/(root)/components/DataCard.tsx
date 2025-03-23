import CarCardProps from "@/interface/props/CarCardProps";
import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";

const CarCard: React.FC<CarCardProps> = ({ car, onClick }) => {
  return (
    <div
      className="grid grid-cols-12 border border-gray-400 rounded-md cursor-pointer hover:shadow-xl hover:border-2"
      onClick={() => car.id && onClick(car.id)}
    >
      <div className="col-span-5 lg:col-span-3 flex justify-center items-center">
        {car.thumbnail ? (
          <Image
            src={car.thumbnail}
            alt={car.title ?? ""}
            width={200}
            height={200}
            className="ms-4 rounded-sm"
          />
        ) : (
          <div className="w-24 h-24 ms-4 bg-gray-300 flex items-center rounded-sm justify-center text-gray-500">
            <Camera size={34} />
          </div>
        )}
      </div>
      <div className="col-span-7 lg:col-span-9 p-8 space-y-2">
        <p className="text-lg font-bold truncate">{car.title}</p>
        <p className="text-md">{car.milage}</p>
        <p className="text-md">{car.price}</p>
      </div>
    </div>
  );
};

export default CarCard;
