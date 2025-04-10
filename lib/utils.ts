import DivarScrapResult from "@/interface/DivarScrapResult";

export function devLog(...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

export async function asyncPool<T, R>(
  limit: number,
  items: T[],
  iteratorFn: (item: T) => Promise<R>
): Promise<R[]> {
  const ret: R[] = []; // To store the results
  const executing: Promise<R>[] = []; // To keep track of ongoing tasks

  // Process each item in the items array
  for (const item of items) {
    const p = iteratorFn(item).then((result) => {
      ret.push(result);
      return result; // Ensure promise resolution
    });

    executing.push(p);

    // If we've hit the concurrency limit, wait for one of the promises to resolve
    if (executing.length >= limit) {
      // Wait for one of the promises to resolve
      await Promise.race(executing);
    }
  }

  // Wait for all remaining promises to resolve
  await Promise.all(executing);

  return ret;
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
