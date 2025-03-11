import { NextRequest, NextResponse } from "next/server";
import Scrapper from "@/lib/Scrapper";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "Query parameter is required" },
        { status: 400 }
      );
    }

    const scrapper = new Scrapper();
    const cars = await scrapper.scrapeDivar(query, 1);

    return NextResponse.json({ cars });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to scrape data" },
      { status: 500 }
    );
  }
}
