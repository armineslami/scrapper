import DivarAdvertise from "@/interface/DivarAdvertise";
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

// Function to convert Persian digits to English digits
const convertPersianToEnglishDigits = (str: string): string => {
  const persianDigits: { [key: string]: string } = {
    "۰": "0",
    "۱": "1",
    "۲": "2",
    "۳": "3",
    "۴": "4",
    "۵": "5",
    "۶": "6",
    "۷": "7",
    "۸": "8",
    "۹": "9",
  };

  return str.replace(/[۰-۹]/g, (match) => persianDigits[match]);
};

// Function to extract a valid numeric value from a string (with Persian digits and commas)
export const extractPrice = (priceStr: string): number | null => {
  // Remove everything except Persian digits, commas, and "تومان" (if it exists).
  const cleanedPriceStr = priceStr.replace(/[^\d۰-۹,]/g, "").replace(/,/g, ""); // Remove commas

  // Convert Persian digits to English digits
  const englishPriceStr = convertPersianToEnglishDigits(cleanedPriceStr);

  // Parse the final price as a number
  const price = parseFloat(englishPriceStr);

  return isNaN(price) ? null : price;
};

// Function to check if the price consists of repeated digits (e.g., 1111, 22222, etc.)
export const isFakePrice = (numStr: string): boolean => {
  // Remove all non-numeric characters (including commas, "تومان", etc.)
  const numericStr = numStr.replace(/[^\d۰-۹]/g, "").replace(/,/g, "");

  // Convert Persian digits to English digits
  const englishNumericStr = convertPersianToEnglishDigits(numericStr);

  // Check for repeated digits (e.g., 111111111, 22222, etc.)
  if (/^(\d)\1+$/.test(englishNumericStr)) {
    return true;
  }

  // If there's no "تومان" in the string, treat it as fake
  if (!numStr.includes("تومان")) {
    return true;
  }

  return false;
};

// Function to extract valid prices from a list of price strings
export const getValidPrices = (priceString: string): number => {
  // Extract the numeric price from the string
  const extractedPrice = extractPrice(priceString);

  return extractedPrice !== null && !isFakePrice(priceString)
    ? extractedPrice
    : 0;
};

// Main function to analyze prices: calculate min, max, and average
export function analyzePrices(divarAdvertises: DivarAdvertise[]): {
  min: number;
  max: number;
  average: number;
} {
  const allPrices: number[] = [];

  divarAdvertises.forEach((advertise) => {
    // Extract valid prices from the strings
    const validPrice = getValidPrices(
      advertise.attributeTwo && advertise.attributeTwo.length > 0
        ? advertise.attributeTwo
        : advertise.attributeOne && advertise.attributeOne.length > 0
        ? advertise.attributeOne
        : ""
    );

    // Add valid prices to the list
    allPrices.push(validPrice);
  });

  const filteredNumbers = allPrices.filter((number) => number !== 0);

  // Calculate min, max, and average
  const min = Math.min(...filteredNumbers);
  const max = Math.max(...filteredNumbers);
  const average =
    filteredNumbers.length > 0
      ? filteredNumbers.reduce((acc, val) => acc + val, 0) /
        filteredNumbers.length
      : 0;

  return { min, max, average: Math.round(average) };
}

export function toPersianNumber(input: number | string): string {
  const englishNumber = Number(input).toLocaleString("en-US"); // add commas
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

  return englishNumber.replace(/\d/g, (d) => persianDigits[Number(d)]);
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
