import { Sku } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);

    await Sku.create(body);

    return NextResponse.json({ message: "Success", body }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}
