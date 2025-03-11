"use client";

import React, { useRef } from "react";
import SearchFormReset from "./SearchFormReset";
import SearchFormProps from "@/interface/props/SearchFormProps";

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, onQueryChange }) => {
  const queryRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch();
        }}
        className="search-form"
      >
        <div className="search-form-input-container">
          <input
            name="query"
            ref={queryRef}
            onChange={(e) => {
              e.preventDefault();
              onQueryChange(e.target.value);
            }}
            placeholder="لینک مورد نظر را وارد کنید"
            className="search-form-input"
          />

          <div className="flex gap-2">
            {queryRef.current?.value && (
              <SearchFormReset
                onResetClick={() => {
                  if (queryRef.current) {
                    queryRef.current.value = "";
                    onQueryChange("");
                  }
                }}
              />
            )}
          </div>
        </div>

        <button type="submit" className="button">
          شروع
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
