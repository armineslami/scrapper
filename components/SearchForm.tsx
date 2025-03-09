import React from "react";
import Form from "next/form";
import SearchFormReset from "./SearchFormReset";

interface SearchFormProps {
  query?: string;
}

const SearchForm: React.FC<SearchFormProps> = ({ query }) => {
  return (
    <Form action="/result" scroll={false} className="search-form">
      <div className="search-form-input-container">
        <input
          name="query"
          defaultValue={query}
          placeholder="Enter the url to scrape"
          className="search-form-input"
        />

        <div className="flex gap-2">{query && <SearchFormReset />}</div>
      </div>

      <button type="submit" className="button">
        Start
      </button>
    </Form>
  );
};

export default SearchForm;
