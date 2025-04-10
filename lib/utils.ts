import DivarScrapResult from "@/interface/DivarScrapResult";

export function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

export function storeToDatabase(data: string) {
  localStorage.setItem("advertises", data);
}

export function readFromDatabase(): DivarScrapResult[] | null {
  const data = localStorage.getItem("advertises");
  if (data) {
    return JSON.parse(data);
  } else {
    return null;
  }
}

export function truncateDatabase() {
  localStorage.removeItem("advertises");
}
