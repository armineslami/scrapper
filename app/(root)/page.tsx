import SearchForm from "@/app/(root)/components/SearchForm";
import HomeProps from "@/interface/props/HomeProps";
import React from "react";

const Home: React.FC<HomeProps> = async () => {
  return (
    <main className="p-8">
      <div className="flex flex-col items-center mt-8">
        <SearchForm />
      </div>
    </main>
  );
};

export default Home;
