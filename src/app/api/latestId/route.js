import { LatestId } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();

    const latestId = await LatestId.create(body);

    return NextResponse.json({ message: "Success", latestId }, { status: 200 });
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
    const name = req.url.split("?")[1].split("=")[1];

    const latestId = await LatestId.findOne({ name });

    return NextResponse.json({ latestId }, { status: 200 });
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

    const latestId = await LatestId.findOneAndUpdate(
      { name: body.name },
      { $set: { id: body.id } },
      { new: true }
    );

    return NextResponse.json({ message: "Success", latestId }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Error", err: err.message },
      { status: 500 }
    );
  }
}
