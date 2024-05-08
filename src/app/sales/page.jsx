"use client";

import SalCus from "@/components/SalCus";
import { categoryList, catSku } from "@/lib/fns/iFns";
import { axiosIn } from "@/lib/query-provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { set } from "mongoose";
import { useEffect, useState } from "react";
import Select from "react-select";
//* ---------------XXXX---------------------/

function calTotal(rows) {
  return rows.reduce((val, arr) => {
    val += arr.total;
    return val;
  }, 0);
}

//* ---------------COMP---------------------/
export default function Sales() {
  // const initialRow = {
  //   skuId: "",
  //   sku: "",
  //   metric: "PCS",
  //   unitPrice: 10,
  // };

  //* ---------------ALL STATES---------------------/
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [balance, setBalance] = useState(() => total);
  const [advance, setAdvance] = useState(0);
  const [sale, setSale] = useState(() => ({
    customer: "",
    items: [],
    total: total,
    balance: balance,
    advance: advance,
  }));
  const [call, setCall] = useState(null);
  //* ---------------API CALLS---------------------/
  async function getOneSku(obj) {
    try {
      const { data } = await axiosIn.post(`/inventory`, {
        sku_id: obj.value,
        mrp: obj.mrp,
      });

      data.total = data.mrp;
      data.sale_qty = 1;

      // todo : the below row.sku_name should be changed to sku_id

      setRows((prev) => {
        if (
          prev.some((row) => row.sku_id === data.sku_id && row.mrp === data.mrp)
        )
          return prev;

        return [...prev, data];
      });
      return;
    } catch (err) {
      console.log(err);
    }
  }

  //* ---------------USE QUERIES---------------------/
  const { data: categoryArr } = useQuery({
    queryKey: ["category"],
    queryFn: categoryList,
  });

  const { data: skuArr } = useQuery({
    queryKey: ["catSkuList", call],
    queryFn: () => catSku(call),
    initialData: [],
  });

  //* ---------------HANDLERS---------------------/
  function remRow(e, obj) {
    const rem = rows.filter(
      (row) => row.sku_id !== obj.sku_id || row.mrp !== obj.mrp
    );

    setRows(() => rem);
  }

  function hQty(e, obj) {
    if (e.target.value === "") return;

    const qty = +e.target.value;

    rows.forEach((row) => {
      if (row.sku_id === obj.sku_id && row.mrp === obj.mrp) {
        if (qty > row.qty) {
          row.sale_qty = row.qty;
          row.total = row.mrp * row.qty;
          return;
        }
        row.sale_qty = qty;
        row.total = row.mrp * qty;
      }
    });

    setRows(() => [...rows]);

    setTotal(() => calTotal(rows));
  }

  function hAdvance(e) {
    setAdvance(() => +e.target.value);
  }

  function hSelSku(e) {
    getOneSku(e);
  }

  async function hSave() {
    const sale = {
      sales_order: "SO-001",
      customer_id: "id",
      customer_name: "Stephen",
      items: rows,
      total: total,
      balance: balance,
      advance: advance,
    };

    const { data } = await axios.post("http://localhost:3000/api/sales", {
      data: sale,
    });

    // todo : the drop down options should be cleared after selection.

    setRows(() => []);
    setTotal(() => 0);
    setBalance(() => 0);
    setAdvance(() => 0);
    setSale(() => sale);
  }

  //**************************EFFECTS*********************************/
  useEffect(() => {
    setTotal(() => calTotal(rows));

    if (rows.length === 0) {
      setBalance(() => 0);
      setAdvance(() => 0);
    }
  }, [rows.length]);

  useEffect(() => {
    if (total < advance) setAdvance(() => total);
    setBalance(() => total - advance);
  }, [total, advance]);

  //* ---------------JSX---------------------/
  return (
    <main className="flex flex-col gap-2 p-2">
      <SalCus />
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
              <th>Sale Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Available Qty</th>
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
                      className="w-full text-center"
                      type="number"
                      name={row.sku_id}
                      id={row.sku_id}
                      min={1}
                      max={row.qty}
                      value={row.sale_qty}
                      onChange={(e) => hQty(e, row)}
                    />
                  </td>

                  <td className="text-center">{row.mrp}</td>

                  <td className="text-center">{row.total}</td>

                  <td className="text-center">{row.qty}</td>

                  <td className="text-center">
                    <div className="flex gap-2">
                      <button
                        className="font-extrabold"
                        onClick={(e) => remRow(e, row)}
                        id={row.sku_id}
                        name={row.sku_name}
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

          <div className="flex gap-4">
            <h4>Advance</h4>
            <input
              type="number"
              min={0}
              max={total}
              onChange={hAdvance}
              disabled={total === 0}
              value={advance}
            />
          </div>

          <div className="flex gap-4">
            <h4>Balance</h4>
            <p>{balance}</p>
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

// todo : save button should be disabled if no total amount and show notification in case of no total amount.
