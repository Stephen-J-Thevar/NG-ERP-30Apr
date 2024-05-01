import { dbConnect, Customer } from "@/lib/db";
import { NextResponse } from "next/server";

// export async function GET(req, res) {
//   const conn = await dbConnect();
//   console.log("Connected");
//   return new NextResponse("Connected to the database", {
//     status: 200,
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// }

export async function GET() {
  try {
    const customer = await Customer.find();

    return NextResponse.json({ customer }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const cusData = body.data;

    await Customer.create(cusData);

    return NextResponse.json({ message: "Success", cusData }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Error", err }, { status: 500 });
  }
}
