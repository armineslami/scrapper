interface SearchFormProps {
  onSearch: (
    query: string,
    numberOfScrolls: number,
    fetchDetails: boolean
  ) => void;
  // onQueryChange: (query: string, numberOfScrolls: string) => void;
}

export default SearchFormProps;
