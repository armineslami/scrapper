import { NextRequest, NextResponse } from "next/server";
import Scrapper from "@/lib/Scrapper";
import { ProtocolError } from "puppeteer";
import DivarAdvertise from "@/interface/DivarAdvertise";

export async function POST(req: NextRequest) {
  try {
    const { queries, numberOfScrolls, openLinks } = await req.json();

    if (!queries) {
      return NextResponse.json(
        { error: "لطفا آدرس را وارد کنید" },
        { status: 422 }
      );
    }

    const scrapper = new Scrapper(
      process.env.HEADLESS_SCRAPPER === "false" ? false : true
    );

    const result: Record<string, DivarAdvertise[]>[] = [];

    for (const query of queries) {
      const advertises = await scrapper.scrapeDivar(
        query,
        numberOfScrolls,
        openLinks
      );
      result.push({ query, advertises });
    }

    return NextResponse.json({ result });
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
