"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import Select from "react-select";

//* ---------------COMP---------------------/
export default function Grn() {
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
  async function getOneSku(id) {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/sales/saleSku`,
        {
          id,
        }
      );

      const saleSku = data.sku[0];

      saleSku.amount = saleSku.price;
      saleSku.qty = 1;

      setRows((prev) => {
        if (prev.some((row) => row.sku_name === saleSku.sku_name)) return prev;

        return [...prev, saleSku];
      });
      return;
    } catch (err) {
      console.log(err);
    }
  }

  async function catSku(cat) {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/sku/catSku",
        {
          cat,
        }
      );

      return data.listArr;
    } catch (err) {
      console.log(err);
      return { stat: "Error", message: err.message };
    }
  }

  async function categoryList() {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/sku/category"
      );

      return data.cat;
    } catch (err) {
      console.log(err);
      return { stat: "Error", message: err.message };
    }
  }

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
    console.log(e.target);

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

    setRows(() => []);
    setTotal(() => 0);
    setBalance(() => 0);
    setAdvance(() => 0);
    setSale(() => sale);
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
                  <td className="text-center">{row.sku_id}</td>

                  <td className="text-center">{row.sku_name}</td>

                  <td className="text-center">{row.metric}</td>

                  <td className="text-center">
                    <input
                      className="text-center"
                      type="number"
                      name={row.id}
                      id={row.id}
                      min={1}
                      value={row.qty}
                      onChange={() => hQty(row)}
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
