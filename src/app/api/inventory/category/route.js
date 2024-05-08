import { Inventory } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const category = await Inventory.distinct("category");
    const cat = category.map((e) => ({ value: e, label: e }));

    return NextResponse.json({ cat }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}
