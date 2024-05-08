import { Sku } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    await Sku.create(body);

    return NextResponse.json(
      { message: "Successfully Created", body },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const sku_id = req.url.split("?")[1].split("=")[1];

    const data = await Sku.findOne({
      sku_id,
    });

    const sku = {
      sku_id: data.sku_id,
      sku_name: data.sku_name,
      category: data.category,
      metric: data.metric,
    };

    return NextResponse.json(sku, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}
