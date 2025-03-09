import axios from "axios";
import * as cheerio from "cheerio";
import Car from "@/interface/Car";
import ScrapeType from "@/interface/ScrapeType";

class Scrapper {
  page: cheerio.CheerioAPI | undefined;

  constructor() {
    this.page = undefined;
  }

  async load(url: string): Promise<boolean> {
    try {
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
          "Upgrade-Insecure-Requests": "1",
          "Cache-Control": "max-age=0",
          Referer: url, // This mimics the referer header that browsers send
        },
        responseEncoding: "utf8",
      });

      if (response.status !== 200) {
        console.error("Error: Failed to fetch the page", response.status);
        return false;
      }

      const $ = cheerio.load(response.data);
      // console.log("Loaded HTML:", response.data); // Debugging

      this.page = $;

      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  start(type: ScrapeType): Car[] | null {
    if (!this.page) {
      return null;
    }

    switch (type) {
      case ScrapeType.Divar:
        return this.scrapDivar(this.page);
    }
  }

  scrapDivar(page: cheerio.CheerioAPI): Car[] | null {
    // Find the div with id 'post-list-container-id'
    const postListDivs = page("#post-list-container-id");
    if (postListDivs.length === 0) {
      console.log("No elements found with id 'post-list-container-id'");
      return null;
    }

    // Find all <article> elements inside the found div
    const articles = postListDivs.find("article");
    if (articles.length === 0) {
      console.log(
        "No <article> elements found inside 'post-list-container-id'"
      );
      return null;
    }

    // Array to store the extracted data
    const extractedData: Car[] = [];

    // Iterate over each article and extract the required information
    articles.each((i, article) => {
      const articleElement = page(article);

      console.log(`Processing article #${i + 1}:`, articleElement.html());

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

      if (titleElement.length === 0)
        console.log(`Title not found in article #${i + 1}`);
      if (milageElement.length === 0)
        console.log(`Milage not found in article #${i + 1}`);
      if (priceElement.length === 0)
        console.log(`Price not found in article #${i + 1}`);
      if (imgElement.length === 0)
        console.log(`Image not found in article #${i + 1}`);

      const title = titleElement.text().trim();
      const milage = milageElement.text().trim();
      const price = priceElement.text().trim();
      const img = imgElement.attr("data-src") || imgElement.attr("src") || "";

      console.log(
        `Title: ${title}, Mileage: ${milage}, Price: ${price}, Img: ${img}`
      );

      if (title) {
        extractedData.push({ title, milage, price, img });
      }
    });

    if (extractedData.length === 0) {
      console.log("No data extracted from articles");
      return null;
    }

    return extractedData; // Return the array of objects
  }
}

export default Scrapper;
