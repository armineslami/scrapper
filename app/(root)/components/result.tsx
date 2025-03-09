import React from "react";

interface ResultProps {
  data: string | null;
}

const Result: React.FC<ResultProps> = ({ data }) => {
  return (
    <div className="p-4">
      <h2>Results</h2>
      <p className="text-nowrap">{JSON.stringify(data, null, 2)}</p>
    </div>
  );
};

export default Result;
