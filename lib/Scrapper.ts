import * as cheerio from "cheerio";
import Car from "@/interface/Car";
import puppeteer, { ProtocolError } from "puppeteer";

class Scrapper {
  page: cheerio.CheerioAPI | undefined;

  constructor() {
    this.page = undefined;
  }

  async scrapeDivar(url: string, scrollTimes: number = 5): Promise<Car[]> {
    const browser = await puppeteer.launch({ headless: false }); // Set to true for no UI
    const page = await browser.newPage();
    const extractedData: Car[] = [];

    try {
      await page.goto(url, { waitUntil: "networkidle2" });
    } catch (error) {
      console.log(error);
      await browser.close();
      if (error instanceof ProtocolError) {
        throw new ProtocolError();
      }
    }

    // Function to extract cars from the page
    const extractCars = async () => {
      const html = await page.content();
      const $ = cheerio.load(html);

      $("#post-list-container-id article").each((i, article) => {
        const articleElement = $(article);

        const titleElement =
          articleElement.find(".kt-post-card__title") ||
          articleElement.find(".unsafe-kt-post-card__title");
        const milageElement =
          articleElement.find(".kt-post-card__description").first() ||
          articleElement.find(".unsafe-kt-post-card__description").first();
        const priceElement =
          articleElement.find(".kt-post-card__description").eq(1) ||
          articleElement.find(".unsafe-kt-post-card__description").eq(1);
        const imgElement =
          articleElement.find(".kt-post-card-thumbnail img") ||
          articleElement.find(".unsafe-kt-post-card-thumbnail img");

        const title = titleElement.text().trim();
        const milage = milageElement.text().trim();
        const price = priceElement.text().trim();
        const img = imgElement.attr("data-src") || imgElement.attr("src") || "";

        if (title && !extractedData.find((car) => car.title === title)) {
          extractedData.push({ title, milage, price, img });
        }
      });
    };

    // **Step 1: Scrape initial content**
    await extractCars();

    // **Step 2: Scroll and load more, handling the button**
    for (let i = 0; i < scrollTimes; i++) {
      // Scroll to the bottom of the page
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight);
      });

      // Wait for content to load
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if the "Load More" button is visible and click it if present
      const loadMoreButton = await page.$(
        ".post-list__load-more-btn-container-cef96 button"
      );

      if (loadMoreButton) {
        console.log("Clicking 'Load More' button...");
        await loadMoreButton.click();
        // Wait for the new content to load after the button click
        await new Promise((resolve) => setTimeout(resolve, 2000)); // Adjust the time as needed
      }

      // Extract the new cars after loading more data
      await extractCars();
    }

    await browser.close();
    console.log("allExtractedData =====>", extractedData);
    return extractedData;
  }
}

export default Scrapper;
