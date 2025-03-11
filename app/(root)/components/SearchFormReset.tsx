"use client";

import React from "react";
import { X } from "lucide-react";
import SearchFormResetProps from "@/interface/props/SearchFormResetProps";

const SearchFormReset: React.FC<SearchFormResetProps> = ({
  onResetClick,
}: {
  onResetClick: () => void;
}) => {
  return (
    <button type="reset" onClick={onResetClick}>
      <div className="search-btn">
        <X className="size-5" />
      </div>
    </button>
  );
};

export default SearchFormReset;
