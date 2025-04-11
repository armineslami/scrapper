import { extractPrice, isFakePrice } from "../lib/utils";

describe("extractPrice", () => {
  it("should extract a Persian price string", () => {
    expect(extractPrice("۱,۲۵۰,۰۰۰ تومان")).toBe(1250000);
  });

  it("should return null for non-price strings", () => {
    expect(extractPrice("رهن کامل")).toBe(null);
    expect(extractPrice("بدون قیمت")).toBe(null);
  });

  it("should handle numbers with no commas", () => {
    expect(extractPrice("۵۰۰۰۰۰ تومان")).toBe(500000);
  });

  it("should handle numbers with commas", () => {
    expect(extractPrice("۵۰۰,۰۰۰ تومان")).toBe(500000);
  });
});

describe("isFakePrice", () => {
  it("should return true for repeated digits", () => {
    expect(isFakePrice("۱۱۱۱۱۱۱ تومان")).toBe(true);
    expect(isFakePrice("111111111 تومان")).toBe(true);
    expect(isFakePrice("2222222")).toBe(true);
  });

  it("should return false for realistic numbers", () => {
    expect(isFakePrice("۱,۲۵۰,۰۰۰ تومان")).toBe(false);
    expect(isFakePrice("۵۰۰۰۰۰ تومان")).toBe(false);
  });

  it("should handle strings with no numbers", () => {
    expect(isFakePrice("بدون قیمت")).toBe(true);
  });

  it("should return false for digits with no price-indicating context included", () => {
    expect(isFakePrice("۲۸,۰۰۰ کیلومتر ")).toBe(true);
    expect(isFakePrice("۵۰۰۰۰۰")).toBe(true);
    expect(isFakePrice("500000")).toBe(true);
    expect(isFakePrice("500,000")).toBe(true);
    expect(isFakePrice("۱,۲۵۶,۷۶۸")).toBe(true);
  });
});
