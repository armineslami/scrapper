interface SearchFormProps {
  onSearch: (
    queries: string[],
    numberOfScrolls: number,
    fetchDetails: boolean
  ) => void;
  // onQueryChange: (query: string, numberOfScrolls: string) => void;
}

export default SearchFormProps;
