import * as cheerio from "cheerio";
import DivarAdvertise from "@/interface/DivarAdvertise";
import puppeteer, { ProtocolError } from "puppeteer";
import { asyncPool } from "./utils";

class Scrapper {
  headless: boolean;

  constructor(headless: boolean = true) {
    this.headless = headless;
  }

  async scrapeDivar(
    url: string,
    scrollTimes: number = 0,
    openLinks: boolean = true
  ): Promise<DivarAdvertise[]> {
    const browser = await puppeteer.launch({ headless: this.headless });
    const page = await browser.newPage();
    const extractedData: DivarAdvertise[] = [];

    try {
      await page.goto(url, { waitUntil: "networkidle2" });
    } catch (error) {
      console.error("Navigation error:", error);
      await browser.close();
      if (error instanceof ProtocolError) {
        throw new ProtocolError();
      }
      return extractedData;
    }

    // Function to scrape detail pages with concurrency
    const extractAdvertises = async () => {
      const html = await page.content();
      const $ = cheerio.load(html);
      const articles = $("#post-list-container-id article").toArray();

      let advertise: DivarAdvertise = {};

      // Loop through articles using their index
      for (let i = 0; i < articles.length; i++) {
        advertise = {
          id: crypto.randomUUID(),
          details: [],
        };

        const article = articles[i];
        const articleElement = $(article);

        // Extract basic listing data
        const titleElement =
          articleElement.find(".kt-post-card__title").first() ||
          articleElement.find(".unsafe-kt-post-card__title").first();
        const attributeOneElement =
          articleElement.find(".kt-post-card__description").first() ||
          articleElement.find(".unsafe-kt-post-card__description").first();
        const attributeTwoElement =
          articleElement.find(".kt-post-card__description").eq(1) ||
          articleElement.find(".unsafe-kt-post-card__description").eq(1);
        const thumbnailElement =
          articleElement.find(".kt-post-card-thumbnail img").first() ||
          articleElement.find(".unsafe-kt-post-card-thumbnail img").first();

        advertise.title = titleElement.text().trim();
        advertise.attributeOne = attributeOneElement.text().trim();
        advertise.attributeTwo = attributeTwoElement.text().trim();
        advertise.thumbnail =
          thumbnailElement.attr("data-src") ||
          thumbnailElement.attr("src") ||
          "";

        const linkElement =
          articleElement.find(".kt-post-card__action").first() ||
          articleElement.find(".unsafe-kt-post-card__action").first();
        const linkUrl = linkElement.attr("href");

        if (linkUrl && openLinks) {
          const fullUrl = new URL(linkUrl, new URL(page.url()).origin).href;

          // Scrape detail pages concurrently with asyncPool
          const detailPageScrape = async () => {
            try {
              const detailPage = await browser.newPage();
              await detailPage.goto(fullUrl, { waitUntil: "networkidle2" });

              await detailPage
                .waitForSelector("article", { timeout: 10000 })
                .catch(() => {
                  console.warn("Detail data not loaded within timeout.");
                });

              const html = await detailPage.content();
              const $ = cheerio.load(html);

              const details = $("article div");
              const detailsSection = details
                .first()
                .find("section")
                .eq(0)
                .children()
                .last();
              const descriptionSection = details.first().find("section").eq(1);
              const imagesSection = details.eq(0).children().eq(1);

              const table = detailsSection.find("table").first();
              let headers: string[] = [];
              table.find("thead th").each((i, element) => {
                headers.push($(element).text().trim());
              });

              let rows: string[] = [];
              table.find("tbody td").each((i, element) => {
                rows.push($(element).text().trim());
              });

              if (headers.length === rows.length) {
                for (let i = 0; i < headers.length; i++) {
                  advertise.details?.push({
                    title: headers[i],
                    value: rows[i],
                  });
                }
              }

              const detailsSectionRows = detailsSection
                .find(".kt-base-row")
                .toArray();

              for (let i = 0; i < detailsSectionRows.length; i++) {
                const row = detailsSectionRows[i];
                const rowElement = $(row);
                const title = rowElement.children().first().text().trim();
                const value = rowElement.children().eq(1).text().trim();

                if (title && value) {
                  advertise.details?.push({
                    title: title,
                    value: value,
                  });
                }
              }

              advertise.description = descriptionSection
                .children()
                .find(".kt-description-row__text")
                .text();

              advertise.image = imagesSection
                .first()
                .find(".keen-slider img")
                ?.attr("src");

              const attributesTable = detailsSection.find("table").eq(1);

              headers = [];
              attributesTable.find("thead th").each((i, element) => {
                headers.push($(element).text().trim());
              });

              rows = [];
              attributesTable.find("tbody td").each((i, element) => {
                rows.push($(element).text().trim());
              });

              if (headers.length === rows.length) {
                for (let i = 0; i < headers.length; i++) {
                  advertise.details?.push({ title: "امکانات", value: rows[i] });
                }
              }

              await detailPage.close();
            } catch (detailError) {
              console.error(
                `Error processing detail page for ${fullUrl}:`,
                detailError
              );
            }
          };

          // Queue up the detail page scrapes concurrently with asyncPool
          await asyncPool(
            Number(process.env.SCRAPPER_CONCURENCY) || 3, // Limit concurrent requests to 3 (or any number depending on your resources)
            [fullUrl], // Queue up the full URL
            detailPageScrape // Pass the scraping function for each URL
          );
        }

        // Avoid duplicates
        if (
          advertise.title &&
          !extractedData.find(
            (c) =>
              c.title === advertise.title &&
              c.attributeTwo === advertise.attributeTwo &&
              c.thumbnail === advertise.thumbnail
          )
        ) {
          extractedData.push(advertise);
        }
      }
    };

    // **Step 1: Scrape initial content**
    await extractAdvertises();

    // **Step 2: Scroll and load more content**
    for (let i = 0; i < scrollTimes; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const loadMoreButton = await page.$(
        ".post-list__load-more-btn-container-cef96 button"
      );
      if (loadMoreButton) {
        console.log("Clicking 'Load More' button...");
        await loadMoreButton.click();
        await page
          .waitForSelector("#post-list-container-id article", { timeout: 5000 })
          .catch(() => {
            console.warn("No new content loaded after clicking 'Load More'.");
          });
      }

      await extractAdvertises();
    }

    await browser.close();

    console.log("--------Result--------");
    console.log(extractedData);
    console.log("----------------------");

    return extractedData;
  }
}

export default Scrapper;
