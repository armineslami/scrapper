import AdvertiseCardProps from "@/interface/props/AdvertiseCardProps";
import { Camera } from "lucide-react";
import Image from "next/image";
import React from "react";

const AdvertiseCard: React.FC<AdvertiseCardProps> = ({
  divarAdvertise,
  onClick,
}) => {
  return (
    <div
      className="grid grid-cols-12 border border-gray-400 rounded-md cursor-pointer hover:shadow-xl hover:border-2"
      onClick={() =>
        divarAdvertise.id &&
        (divarAdvertise.description ||
          (divarAdvertise.details && divarAdvertise.details.length > 0)) &&
        onClick(divarAdvertise.id)
      }
    >
      <div className="col-span-5 lg:col-span-3 flex justify-center items-center">
        {divarAdvertise.thumbnail ? (
          <Image
            src={divarAdvertise.thumbnail}
            alt={divarAdvertise.title ?? ""}
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
        <p className="text-lg font-bold truncate">{divarAdvertise.title}</p>
        <p className="text-md">{divarAdvertise.milage}</p>
        <p className="text-md">{divarAdvertise.price}</p>
      </div>
    </div>
  );
};

export default AdvertiseCard;
