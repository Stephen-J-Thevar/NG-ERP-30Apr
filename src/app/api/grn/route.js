import { Grn } from "@/lib/db";
import { NextResponse } from "next/server";

// todo : this should give all the inventory data
export async function GET() {
  try {
    const grn = await Grn.find();

    return NextResponse.json({ grn }, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();

    await Grn.create(body);

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

export async function PUT(req) {
  try {
    const body = await req.json();

    const grn = await Grn.findOneAndUpdate(
      { _id: body.id },
      { $set: body },
      { new: true }
    );

    return NextResponse.json({ message: "Success", grn }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}
