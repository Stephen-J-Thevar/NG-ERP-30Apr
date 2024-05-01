"use client";

import { axiosIn } from "@/lib/query-provider";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import CreateableSelect from "react-select/creatable";

const metricArr = [
  { value: "PCS", label: "PCS" },
  { value: "KG", label: "KG" },
  { value: "L", label: "L" },
  { value: "M", label: "M" },
];

const categoryArr = [
  { value: "catA", label: "catA" },
  { value: "catB", label: "catB" },
  { value: "catC", label: "catC" },
  { value: "catD", label: "catD" },
];

async function getSkuId() {
  try {
    const { data } = await axiosIn.get("/latestId?name=sku");
    return data.latestId.id;
  } catch (err) {
    return { error: "error", message: err.message };
  }
}
// todo: name should not be repeated do check the db for duplication

function incrementId(id) {
  try {
    if (!id) throw new Error("id is not defined");

    const id_arr = id.split("-");
    const num = id_arr[2];
    const current_year = new Date().getFullYear().toString().slice(2);

    const newId = (parseInt(num) + 1).toString().padStart(6, "0");

    const new_sku_id = `SKU-${current_year}-${newId}`;

    return new_sku_id;
  } catch (err) {
    return { error: "error", message: err.message };
  }
}

//**************************COMP*********************************/
export default function Sku() {
  const priceRef = useRef();
  const skuNameRef = useRef();
  const [metric, setMetric] = useState();
  const [category, setCategory] = useState();

  const {
    data: skuId,
    isFetching: idL,
    isError: idE,
  } = useQuery({
    queryKey: ["skuId"],
    queryFn: getSkuId,
  });

  //**************************HANDLERS*********************************/
  // todo : handle all the id later coz it has to be auto incremental
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (
        !skuNameRef.current.value ||
        !metric ||
        !category ||
        !priceRef.current.value
      )
        throw new Error("All fields are required");

      const sku = {
        sku_id: incrementId(skuId),
        sku_name: skuNameRef.current.value,
        metric: metric,
        category: category,
      };

      // console.log(sku);
      // const { data } = await axios.post(
      //   "http://localhost:3000/api/sku/master",
      //   {
      //     data: sku,
      //   }
      // );

      const { data } = await axiosIn.post("/sku/master", sku);

      const { data: putId } = await axiosIn.put("/latestId", {
        name: "sku",
        id: sku.sku_id,
      });

      console.log(putId.latestId.id);

      console.log(data.message);

      skuNameRef.current.value = "";
      setMetric(() => "");
      setCategory(() => "");
      priceRef.current.value = "";
    } catch (err) {
      console.log(err); //! todo: remove log later
      // todo : give some notification
    }
  }
  //**************************JSX*********************************/
  return (
    <div>
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex">
            <label htmlFor="skuId">SKU ID :</label>
            <div id="skuId">
              {idL && "Loading..."}
              {!idL && incrementId(skuId)}
              {idE && "Error"}
            </div>
          </div>

          <div>
            <label htmlFor="skuName">SKU NAME :</label>
            <input ref={skuNameRef} type="text" id="skuName" />
          </div>

          <div>
            <label>Category :</label>
            {/* <Select
              options={categoryArr}
              onChange={(e) => console.log(e.value)}
              // onChange={(e) => setCategory(e.value)}
            /> */}
            <CreateableSelect
              isClearable
              onChange={(e) => setCategory(e.value)}
              options={categoryArr}
            />
          </div>

          <div>
            <label>Metric</label>
            {/* <Select options={metricArr} onChange={(e) => setMetric(e.value)} /> */}
            <CreateableSelect
              isClearable
              onChange={(e) => setMetric(e.value)}
              options={metricArr}
            />
          </div>

          <button className="bg-blue-700" type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

// todo :should I have a  separate collection to store all the ids and then use it to generate new id for all. Or should I query the db to get the last id and then increment it by 1.
