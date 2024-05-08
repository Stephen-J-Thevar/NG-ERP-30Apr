import mongoose, { Schema } from "mongoose";

// global.mongoose = {
//   conn: null,
//   promise: null,
// };

// export async function dbConnect() {
//   try {
//     if (global.mongoose && global.mongoose.conn) {
//       console.log("Connected from previous");
//       return global.mongoose.conn;
//     } else {
//       const conString = process.env.MONGO_URI;

//       const promise = mongoose.connect(conString, {
//         autoIndex: true,
//       });

//       global.mongoose = {
//         conn: await promise,
//         promise,
//       };

//       console.log("Newly connected");
//       return await promise;
//     }
//   } catch (error) {
//     console.error("Error connecting to the database:", error);
//     throw new Error("Database connection failed");
//   }
// }

// export const disconnect = () => {
//   if (!global.mongoose.conn) {
//     return;
//   }
//   global.mongoose.conn = null;
//   mongoose.disconnect();
// };

mongoose.connect(process.env.MONGO_URI);

mongoose.Promise = global.Promise;

const customerSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    phone: {
      type: Number,
      required: true,
      unique: true,
    },
    address: String,
    city: String,
    state: String,
    country: String,
    postal: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const salesSchema = new Schema(
  {
    // customer: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Customer",
    // },
    sales_order: String,
    customer_id: String,
    customer_name: String,
    items: [
      {
        id: String,
        sku: String,
        metric: String,
        price: Number,
        amount: Number,
        qty: Number,
      },
    ],
    total: Number,
    balance: Number,
    advance: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const skuSchema = new Schema(
  {
    sku_id: String,
    sku_name: String,
    metric: String,
    category: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const grnSchema = new Schema(
  {
    grn_id: String,
    // grn_date: Date,
    items: [
      {
        sku_id: String,
        sku_name: String,
        metric: String,
        price: Number,
        qty: Number,
      },
    ],
    total: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const latestIdSchema = new Schema(
  {
    name: String,
    id: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const inventorySchema = new Schema(
  {
    sku_id: String,
    sku_name: String,
    category: String,
    metric: String,
    qty: Number,
    mrp: Number,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Customer =
  mongoose.models.customers || mongoose.model("customers", customerSchema);

const Sales = mongoose.models.sales || mongoose.model("sales", salesSchema);

const Sku =
  mongoose.models.sku_masters || mongoose.model("sku_masters", skuSchema);

const Grn = mongoose.models.grns || mongoose.model("grns", grnSchema);

const LatestId =
  mongoose.models.latest_ids || mongoose.model("latest_ids", latestIdSchema);

const Inventory =
  mongoose.models.inventories || mongoose.model("inventories", inventorySchema);

export { Customer, Sales, Sku, Grn, LatestId, Inventory };

// todo :separate all the schemas later
