"use client";
import { useState, useEffect } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import {
  categoryList,
  catSku,
  getId,
  incrementId,
  skuCategoryList,
  skuCatSku,
  skuCatsku,
} from "@/lib/fns/iFns";
import { axiosIn } from "@/lib/query-provider";

//* ---------------COMP---------------------/
export default function GRN() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [grn, setGrn] = useState(() => ({
    items: [],
    total: total,
  }));
  const [call, setCall] = useState(null);
  console.log(call);

  //* ---------------API CALLS USEQUERIES---------------------/
  const {
    data: grnId,
    isFetching: idL,
    isError: idE,
  } = useQuery({
    queryKey: ["grnId"],
    queryFn: () => getId("grn"),
  });

  async function getSku(sku_id) {
    try {
      const { data } = await axiosIn.get(`/sku/master?sku_id=${sku_id}`);

      data.qty = 1;
      data.mrp = 0;
      data.total = 0;

      setRows((prev) => {
        if (prev.some((row) => row.sku_id === data.sku_id)) return prev;

        return [...prev, data];
      });

      return;
    } catch (error) {
      console.error(error);
    }
  }

  //* ---------------USE QUERIES---------------------/
  const { data: categoryArr } = useQuery({
    queryKey: ["skuCategory"],
    queryFn: skuCategoryList,
  });

  console.log(call);
  console.log(categoryArr);
  const { data: skuArr } = useQuery({
    queryKey: ["skuCatSkuList", call],
    queryFn: () => skuCatSku(call),
    initialData: [],
  });
  console.log(skuArr);

  //* ---------------HANDLERS---------------------/
  function remRow(e, sku) {
    // if (rows.length > 1) {
    //   setRows(() => rows.slice(0, -1));
    // }

    const rem = rows.filter((row) => row.sku_id !== sku.sku_id);

    setRows(() => rem);
  }

  function hQty(e, sku) {
    // todo : handle if no value is entered

    const qty = +e.target.value;

    rows.forEach((row) => {
      if (row.sku_id === sku.sku_id) {
        row.qty = qty;
        row.total = row.mrp * qty;
      }
    });

    setRows(() => [...rows]);

    setTotal(() =>
      rows.reduce((val, arr) => {
        val += arr.total;
        return val;
      }, 0)
    );
  }

  function hMrp(e, sku) {
    try {
      const mrp = +e.target.value;

      rows.forEach((row) => {
        if (row.sku_id === sku.sku_id) {
          row.mrp = mrp;
          row.total = row.qty * mrp;
        }
      });

      setRows(() => [...rows]);

      setTotal(() =>
        rows.reduce((val, arr) => {
          val += arr.total;
          return val;
        }, 0)
      );
    } catch (error) {
      console.error(error);
    }
  }

  function hSelSku(e) {
    getSku(e.value);
  }

  async function hSave() {
    const grn = {
      grn_id: incrementId(grnId),
      items: rows,
      total: total,
    };

    const { data } = await axiosIn.post("/grn", grn);

    const { data: inventory } = await axiosIn.put("/inventory", rows);

    setRows(() => []);
    setTotal(() => 0);
  }

  //**************************EFFECTS*********************************/
  useEffect(() => {
    setTotal(() =>
      rows.reduce((val, arr) => {
        val += arr.amount;
        return val;
      }, 0)
    );
  }, [rows.length]);

  //* ---------------JSX---------------------/
  return (
    <main className="flex flex-col gap-2 p-2">
      {/* //* ---------------XXXXX---------------------/ */}
      <div className="flex gap-2">
        <div className="w-80">
          <Select options={categoryArr} onChange={(e) => setCall(e.value)} />
        </div>

        <div className="w-80">
          <Select options={skuArr} onChange={(e) => hSelSku(e)} />
        </div>
      </div>
      {/* //* ---------------XXXXX---------------------/ */}
      <section className="h-64 bg-white">
        <table className="w-full">
          <thead>
            <tr>
              <th>Product Id</th>
              <th>Product</th>
              <th>Category</th>
              <th>Metric</th>
              <th>Quantity</th>
              <th>MRP</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 &&
              rows.map((row, index) => (
                <tr key={index}>
                  <td className="text-center">{row.sku_id}</td>

                  <td className="text-center">{row.sku_name}</td>

                  <td className="text-center">{row.category}</td>

                  <td className="text-center">{row.metric}</td>

                  <td className="text-center">
                    <input
                      className="text-center"
                      type="number"
                      name={row.sku_id}
                      id={row.sku_id}
                      min={1}
                      // value={row.qty}
                      onChange={(e) => hQty(e, row)}
                    />
                  </td>

                  <td className="text-center">
                    <input
                      className="text-center"
                      type="number"
                      name={row.sku_id}
                      id={row.sku_id}
                      min={1}
                      // value={row.mrp}
                      onChange={(e) => hMrp(e, row)}
                    />
                  </td>

                  <td className="text-center">{row.total}</td>

                  <td className="text-center">
                    <div className="flex gap-2">
                      <button
                        className="font-extrabold"
                        onClick={(e) => remRow(e, row)}
                        id={row.sku_id}
                        name={row.sku_id}
                      >
                        -
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </section>

      <section className="flex items-end justify-end bg-white">
        <div>
          <div className="flex gap-4">
            <h4>Total</h4>
            <p>{total}</p>
          </div>
        </div>

        <div>
          <button
            disabled={total === 0}
            onClick={hSave}
            className={`p-2 text-white  ${
              total === 0 ? "bg-gray-500" : "bg-blue-500"
            }`}
          >
            Save
          </button>
        </div>
      </section>
    </main>
  );
}
// todo : make sure it cannot be submitted when total, qty, price is 0
