// import Image from "next/image";
import { IoInformationCircleOutline } from "react-icons/io5";

const FreqLabel = (freq: string) => {
  let colorClassName = "";
  let labelName = "";
  let description = "";

  if (freq == "fundamental") {
    labelName = "Fundamental";
    colorClassName = "bg-green-400";
    description = "Essential building blocks";
  } else if (freq == "common") {
    labelName = "Common";
    colorClassName = "bg-orange-400";
    description = "Uncommon or niche topics";
  } else if (freq == "occasional") {
    labelName = "Occasional";
    colorClassName = "bg-blue-400";
    description = "Sometimes appears";
  } else if (freq == "rare") {
    labelName = "Rare";
    colorClassName = "bg-purple-400";
    description = "Uncommon or niche topics";
  } else {
    labelName = "Unknown";
    colorClassName = "bg-gray-400";
    description = "This post wasn't labeled correctly";
  }

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 ${colorClassName} text-white`}
    >
      <span>{labelName}</span>
      <span>
        <div className="group relative">
          <IoInformationCircleOutline className="text-lg" />
          <span className="absolute left-1/2 mx-auto mt-2 -translate-x-1/2 rounded-md bg-gray-800 p-2 px-2 text-sm text-gray-100 opacity-0 transition-opacity group-hover:opacity-100">
            {description}
          </span>
        </div>
      </span>
    </div>
  );
};

export default FreqLabel;
