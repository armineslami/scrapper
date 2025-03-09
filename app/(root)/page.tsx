import SearchForm from "@/components/SearchForm";
import HomeProps from "@/interface/props/HomeProps";
import React from "react";

const Home: React.FC<HomeProps> = async ({ searchParams }) => {
  const query = (await searchParams).query;

  return (
    <main className="p-8">
      <div className="flex flex-col items-center mt-16">
        <SearchForm query={query} />
      </div>
    </main>
  );
};

export default Home;
