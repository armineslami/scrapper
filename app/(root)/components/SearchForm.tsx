"use client";

import React, { useCallback, useMemo, useState } from "react";
import SearchFormProps from "@/interface/props/SearchFormProps";
import { Minus, Plus } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

interface DynamicInput {
  id: string;
  link: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const methods = useForm();

  const createInputs = (
    inputs: { id: string; link: string }[]
  ): DynamicInput[] =>
    inputs.slice(1).map((input) => ({
      id: input.id.toString(),
      link: input.link,
    }));

  const initialInputs = useMemo(() => createInputs([]), []);

  const [inputs, setInputs] = useState<DynamicInput[]>(initialInputs);

  const addInput = useCallback(() => {
    const newId = Math.random().toString(36).substr(2, 9);
    setInputs((prev) => [...prev, { id: newId, link: "" }]);
  }, []);

  const removeInput = useCallback(
    (id: string) => {
      setInputs((prev) => prev.filter((office) => office.id !== id));
      methods.unregister(`link_${id}`);
    },
    [methods]
  );

  const onSubmit = async (data: Record<string, string>) => {
    const transformFormData: string[] = [];
    Object.entries(data).flatMap(([key, value]) => {
      if (key.startsWith("link_")) {
        transformFormData.push(value);
      }
    });

    onSearch(
      transformFormData,
      Number(data.numberOfScrolls),
      data.openLinks === "1"
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="search-form">
          <div className="w-full flex flex-col gap-2">
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-11 flex flex-row gap-2">
                <div className="w-full">
                  <p className="text-sm">لینک دیوار</p>
                  <div className="form-input-container ">
                    <input
                      {...methods.register(`link_0`)}
                      name="link_0"
                      placeholder="لینک مورد نظر را وارد کنید"
                      className="search-form-input"
                    />
                  </div>
                </div>
              </div>
              <div
                className="flex justify-end cursor-pointer"
                onClick={addInput}
              >
                <Plus />
              </div>
            </div>

            {/* Dynamic Inputs */}
            {inputs.map((input) => (
              <div
                className="grid grid-cols-12 gap-2 items-center"
                key={input.id}
              >
                <div className="col-span-11 flex flex-row gap-2">
                  <div className="w-full">
                    <p className="text-sm">لینک دیوار</p>
                    <div className="form-input-container ">
                      <input
                        {...methods.register(`link_${input.id}`)}
                        defaultValue={input.link}
                        placeholder="لینک مورد نظر را وارد کنید"
                        className="search-form-input"
                      />
                    </div>
                  </div>
                </div>
                <div
                  className="flex justify-end cursor-pointer"
                  onClick={() => removeInput(input.id)}
                >
                  <Minus />
                </div>
              </div>
            ))}

            <div className="col-span-12 lg:col-span-4 grid grid-cols-12 gap-2">
              <div className="col-span-6">
                <p className="text-sm">تعداد اسکرول</p>
                <div className="form-input-container">
                  <input
                    {...methods.register("numberOfScrolls")}
                    name="numberOfScrolls"
                    type="number"
                    placeholder="تعداد اسکرول"
                    className="search-form-input h-full"
                  />
                </div>
              </div>
              <div className="col-span-6">
                <p className="text-sm">دریافت جزئیات</p>
                <div className="form-input-container">
                  <select
                    {...methods.register("openLinks")}
                    name="openLinks"
                    className="search-form-input h-full"
                  >
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
      </FormProvider>
    </div>
  );
};

export default SearchForm;
