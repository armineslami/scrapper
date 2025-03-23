import * as cheerio from "cheerio";
import Car from "@/interface/Car";
import puppeteer, { ProtocolError } from "puppeteer";

class Scrapper {
  headless: boolean;

  constructor(headless: boolean = true) {
    this.headless = headless;
  }

  async scrapeDivar(
    url: string,
    scrollTimes: number = 0,
    openLinks: boolean = true
  ): Promise<Car[]> {
    const browser = await puppeteer.launch({ headless: this.headless });
    const page = await browser.newPage();
    const extractedData: Car[] = [];

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

    // Function to extract cars from the listing page
    const extractCars = async () => {
      const html = await page.content();
      const $ = cheerio.load(html);
      const articles = $("#post-list-container-id article").toArray();

      let car: Car = {};

      // Loop through articles using their index
      for (let i = 0; i < articles.length; i++) {
        // articles.length
        // reset;
        car = {
          id: crypto.randomUUID(),
          details: [],
        };

        //articles.length
        const article = articles[i];
        const articleElement = $(article);

        // Extract basic listing data
        const titleElement =
          articleElement.find(".kt-post-card__title").first() ||
          articleElement.find(".unsafe-kt-post-card__title").first();
        const milageElement =
          articleElement.find(".kt-post-card__description").first() ||
          articleElement.find(".unsafe-kt-post-card__description").first();
        const priceElement =
          articleElement.find(".kt-post-card__description").eq(1) ||
          articleElement.find(".unsafe-kt-post-card__description").eq(1);
        const thumbnailElement =
          articleElement.find(".kt-post-card-thumbnail img").first() ||
          articleElement.find(".unsafe-kt-post-card-thumbnail img").first();

        car.title = titleElement.text().trim();
        car.milage = milageElement.text().trim();
        car.price = priceElement.text().trim();
        car.thumbnail =
          thumbnailElement.attr("data-src") ||
          thumbnailElement.attr("src") ||
          "";

        const linkElement =
          articleElement.find(".kt-post-card__action").first() ||
          articleElement.find(".unsafe-kt-post-card__action").first();
        const linkUrl = linkElement.attr("href");

        if (linkUrl && openLinks) {
          const fullUrl = new URL(linkUrl, new URL(page.url()).origin).href;
          try {
            const detailPage = await browser.newPage();
            await detailPage.goto(fullUrl, { waitUntil: "networkidle2" });

            // Wait for and extract the desired detail data:
            await detailPage
              .waitForSelector("article", {
                timeout: 10000,
              })
              .catch(() => {
                console.warn("Detail data not loaded within timeout.");
              });

            const html = await detailPage.content();
            const $ = cheerio.load(html);

            // Details container
            const details = $("article div");

            // Details section
            const detailsSection = details
              .first()
              .find("section")
              .eq(0)
              .children()
              .last();

            // Description section
            const descriptionSection = details
              .first() // first div
              .find("section")
              .eq(1); // second section

            // Image section
            const imagesSection = details.eq(0).children().eq(1);

            // Extracting the top details
            const table = detailsSection.find("table").first();

            // Get the data from the `thead` (headers)
            let headers: string[] = [];
            table.find("thead th").each((i, element) => {
              headers.push($(element).text().trim());
            });

            // Get the data from the `tbody` (rows)
            let rows: string[] = [];
            table.find("tbody td").each((i, element) => {
              rows.push($(element).text().trim());
            });

            if (headers.length === rows.length) {
              for (let i = 0; i < headers.length; i++) {
                car.details?.push({ title: headers[i], value: rows[i] });
              }
            }

            // Extrating the details
            const detailsSectionRows = detailsSection
              .find(".kt-base-row")
              .toArray();

            // const detailsObject: { title?: string; value?: string } = {};
            for (let i = 0; i < detailsSectionRows.length; i++) {
              const row = detailsSectionRows[i];
              const rowElement = $(row);
              const title = rowElement.children().first().text().trim();
              const value = rowElement.children().eq(1).text().trim();

              if (title && value) {
                car.details?.push({
                  title: title,
                  value: value,
                });
              }
            }

            // Extracting the description
            car.description = descriptionSection
              .children()
              .find(".kt-description-row__text")
              .text();

            car.image = imagesSection
              .first()
              .find(".keen-slider img")
              ?.attr("src");

            // The second table is attributes which exists for some advertises
            const attributesTable = detailsSection.find("table").eq(1);

            // Get the data from the `thead` (headers)
            headers = [];
            attributesTable.find("thead th").each((i, element) => {
              headers.push($(element).text().trim());
            });

            // Get the data from the `tbody` (rows)
            rows = [];
            attributesTable.find("tbody td").each((i, element) => {
              rows.push($(element).text().trim());
            });

            if (headers.length === rows.length) {
              for (let i = 0; i < headers.length; i++) {
                car.details?.push({ title: "امکانات", value: rows[i] });
              }
            }

            await detailPage.close();
          } catch (detailError) {
            console.error(
              `Error processing detail page for ${fullUrl}:`,
              detailError
            );
          }
        }

        // Avoid duplicates
        if (
          car.title &&
          !extractedData.find(
            (c) =>
              c.title === car.title &&
              c.price === car.price &&
              c.thumbnail === car.thumbnail
          )
        ) {
          extractedData.push(car);
        }
      }
    };

    // **Step 1: Scrape initial content**
    await extractCars();

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

      await extractCars();
    }

    await browser.close();

    console.log("--------Result--------");
    console.log(extractedData);
    console.log("----------------------");

    return extractedData;
  }
}

export default Scrapper;
