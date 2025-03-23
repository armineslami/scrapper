import { NextRequest, NextResponse } from "next/server";
import Scrapper from "@/lib/Scrapper";
import { ProtocolError } from "puppeteer";

export async function POST(req: NextRequest) {
  try {
    const { query, numberOfScrolls } = await req.json();

    if (!query) {
      return NextResponse.json(
        { error: "لطفا آدرس را وارد کنید" },
        { status: 422 }
      );
    }

    const scrapper = new Scrapper();
    const cars = await scrapper.scrapeDivar(query, numberOfScrolls);

    return NextResponse.json({ cars });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof ProtocolError
            ? "پروتکل معتبر نمی‌باشد"
            : "خطا در انجام عملیات",
      },
      { status: 500 }
    );
  }
}
