"use client";

import React, { useRef } from "react";
import SearchFormReset from "./SearchFormReset";
import SearchFormProps from "@/interface/props/SearchFormProps";

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(
            queryRef.current?.value ?? "",
            scrollRef.current?.value ? Number(scrollRef.current.value) : 0
          );
        }}
        className="search-form"
      >
        <div className="w-full grid grid-cols-12 gap-2">
          <div className="search-form-input-container col-span-12 lg:col-span-10">
            <input
              name="query"
              ref={queryRef}
              // onChange={(e) => {
              //   e.preventDefault();
              //   onQueryChange(e.target.value);
              // }}
              placeholder="لینک مورد نظر را وارد کنید"
              className="search-form-input"
            />

            <div className="flex gap-2">
              {queryRef.current?.value && (
                <SearchFormReset
                  onResetClick={() => {
                    if (queryRef.current) {
                      queryRef.current.value = "";
                      // onQueryChange("");
                    }
                  }}
                />
              )}
            </div>
          </div>

          <div className="search-form-input-container col-span-12 lg:col-span-2">
            <input
              name="numberOfScrolls"
              ref={scrollRef}
              type="number"
              placeholder="تعداد اسکرول"
              className="search-form-input"
            />
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
