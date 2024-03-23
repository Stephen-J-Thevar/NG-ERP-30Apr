"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import SalCus from "@/components/SalCus";

//* ---------------COMP---------------------/
export default function Sales() {
  //note: Same SKU twice not allowed
  // const initialRow = {
  //   skuId: "",
  //   sku: "",
  //   metric: "PCS",
  //   unitPrice: 10,
  // };

  //* ---------------ALL STATES---------------------/
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState();
  const [balance, setBalance] = useState(() => total);
  const [advance, setAdvance] = useState();

  //* ---------------API CALLS---------------------/
  async function getOneSku(sku) {
    try {
      const { data } = await axios.get(`http://localhost:3005/NGSKU/${sku}`);

      data.amount = data.price;
      data.qty = 1;

      setRows((prev) => {
        if (prev.some((row) => row.id === data.id)) return prev;

        return [...prev, data];
      });
      return;
    } catch (err) {
      console.log(err);
    }
  }

  async function getSku() {
    try {
      const { data } = await axios.get("http://localhost:3005/NGSKU");
      const sku = data.map((e) => ({ value: e.id, label: e.sku }));
      return sku;
    } catch (err) {
      console.log(err);
    }
  }

  const { data: skuArr } = useQuery({
    queryKey: ["sku"],
    queryFn: getSku,
    initialData: [],
  });

  //* ---------------HANDLERS---------------------/
  function remRow(e) {
    const id = e.target.id;
    if (rows.length > 1) {
      setRows(rows.slice(0, -1));
    }

    const rem = rows.filter((row) => row.id !== id);
    setRows(() => rem);
  }

  function hQty(e) {
    if (e.target.value === "") return;

    const id = e.target.name;
    const qty = +e.target.value;

    rows.forEach((row) => {
      if (row.id === id) {
        row.qty = qty;
        row.amount = row.price * qty;
      }
    });

    setRows(() => [...rows]);

    setTotal(() =>
      rows.reduce((val, arr) => {
        val += arr.amount;
        return val;
      }, 0)
    );

    setBalance(() => 0);
  }

  function hAdvance(e) {
    setAdvance(+e.target.value);
    setBalance(total - +e.target.value);
  }

  function hSelSku(e) {
    getOneSku(e.value);
  }

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
      <SalCus />
      {/* //* ---------------XXXXX---------------------/ */}
      <div className="flex gap-2">
        <div className="w-80">
          <Select options={skuArr} onChange={(e) => hSelSku(e)} />
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
              <th>Metric</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>

          <tbody>
            {rows.length > 0 &&
              rows.map((row, index) => (
                <tr key={index}>
                  <td className="text-center">{row.id}</td>

                  <td className="text-center">{row.sku}</td>

                  <td className="text-center">{row.metric}</td>

                  <td className="text-center">
                    <input
                      className="text-center"
                      type="number"
                      name={row.id}
                      id={row.id}
                      min={1}
                      value={row.qty}
                      onChange={hQty}
                    />
                  </td>

                  <td className="text-center">{row.price}</td>

                  <td className="text-center">{row.amount}</td>

                  <td className="text-center">
                    <div className="flex gap-2">
                      <button
                        className="font-extrabold"
                        onClick={(e) => remRow(e)}
                        id={row.id}
                        name={row.id}
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
            <input type="number" min={0} onChange={hAdvance} value={advance} />
          </div>

          <div className="flex gap-4">
            <h4>Balance</h4>
            <p>{balance}</p>
          </div>
        </div>

        <div>
          <div className="flex gap-4">
            <h4>Total</h4>
            <p>{total}</p>
          </div>

          <div className="flex gap-4">
            <h4>Advance</h4>
            <input type="number" min={0} onChange={hAdvance} value={advance} />
          </div>

          <div className="flex gap-4">
            <h4>Balance</h4>
            <p>{balance}</p>
          </div>
        </div>
      </section>
    </main>
  );
}
