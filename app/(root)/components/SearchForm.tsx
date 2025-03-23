"use client";

import React, { useRef } from "react";
import SearchFormReset from "./SearchFormReset";
import SearchFormProps from "@/interface/props/SearchFormProps";

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const queryRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLInputElement>(null);
  const openLinksRef = useRef<HTMLSelectElement>(null);

  return (
    <div className="w-full flex flex-col items-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(
            queryRef.current?.value ?? "",
            scrollRef.current?.value ? Number(scrollRef.current.value) : 0,
            openLinksRef.current?.value &&
              openLinksRef.current?.value.toString() === "1"
              ? true
              : false
          );
        }}
        className="search-form"
      >
        <div className="w-full grid grid-cols-12 gap-2">
          <div className="col-span-12 lg:col-span-8">
            <p className="text-sm">لینک دیوار</p>
            <div className="search-form-input-container ">
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
          </div>

          <div className="col-span-12 lg:col-span-4 grid grid-cols-12 gap-2">
            <div className="col-span-6">
              <p className="text-sm">تعداد اسکرول</p>
              <div className="search-form-input-container">
                <input
                  name="numberOfScrolls"
                  ref={scrollRef}
                  type="number"
                  placeholder="تعداد اسکرول"
                  className="search-form-input h-full"
                />
              </div>
            </div>
            <div className="col-span-6">
              <p className="text-sm">دریافت جزئیات</p>
              <div className="search-form-input-container ">
                <select ref={openLinksRef} className="search-form-input h-full">
                  <option value={1}>بله</option>
                  <option value={0}>خیر</option>
                </select>
              </div>
            </div>
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
