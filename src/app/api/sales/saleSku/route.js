import { NextResponse } from "next/server";
import { Sku } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const sku = await Sku.find({ _id: body.id });

    return NextResponse.json({ sku }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}
