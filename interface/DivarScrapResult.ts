import DivarAdvertise from "./DivarAdvertise";

interface DivarScrapResult {
  query: string;
  advertises: DivarAdvertise[];
  error?: boolean;
}

export default DivarScrapResult;
