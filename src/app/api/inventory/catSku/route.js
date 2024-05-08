import { NextResponse } from "next/server";
import { Inventory } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const list = await Inventory.find({ category: body.cat });

    const listArr = list.map((e) => ({
      value: e.sku_id,
      label: e.sku_name,
      mrp: e.mrp,
    }));

    return NextResponse.json({ listArr }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}
