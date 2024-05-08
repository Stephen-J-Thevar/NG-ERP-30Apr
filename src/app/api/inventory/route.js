import { Inventory } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const data = await Inventory.find();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.trace(error);
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);

    const sku = await Inventory.findOne(body);

    const data = {
      sku_id: sku.sku_id,
      sku_name: sku.sku_name,
      category: sku.category,
      metric: sku.metric,
      mrp: sku.mrp,
      qty: sku.qty,
    };

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.trace(error);
  }
}

// export async function PUT(req) {
//   try {
//     const body = await req.json();

//     const inventory = await Inventory.findOneAndUpdate(
//       { _id: body.id },
//       { $set: body },
//       { new: true }
//     );

//     return NextResponse.json(
//       { message: "Success", inventory },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.trace(error);
//   }
// }

export async function PUT(req) {
  try {
    const body = await req.json();

    body.forEach(async (obj) => {
      const inventory = await Inventory.findOne({
        sku_id: obj.sku_id,
        mrp: obj.mrp,
      });

      if (inventory) {
        await Inventory.findOneAndUpdate(
          { sku_id: inventory.sku_id, mrp: inventory.mrp },
          { $inc: { qty: obj.qty } }
          // { new: true }
        );
      } else {
        await Inventory.create({
          sku_id: obj.sku_id,
          sku_name: obj.sku_name,
          category: obj.category,
          metric: obj.metric,
          mrp: obj.mrp,
          qty: obj.qty,
        });
      }
    });

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error", error }, { status: 500 });
  }
}
