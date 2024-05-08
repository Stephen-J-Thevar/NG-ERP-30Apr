"use client";

import { getId, incrementId } from "@/lib/fns/iFns";
import { axiosIn } from "@/lib/query-provider";
import { useQuery } from "@tanstack/react-query";
import { useRef, useState } from "react";
import CreateableSelect from "react-select/creatable";
import { Notification, useToaster } from "rsuite";
import "rsuite/dist/rsuite-no-reset.min.css";

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

function toast(msg, type) {
  const message = (
    <Notification type={type} header={type} closable>
      <p>{msg}</p>
    </Notification>
  );

  return message;
}
// todo: name should not be repeated do check the db for duplication

//**************************COMP*********************************/
export default function Sku() {
  const skuNameRef = useRef();
  const toaster = useToaster();
  // const router = useRouter();

  const [metric, setMetric] = useState();
  const [category, setCategory] = useState();

  const {
    data: skuId,
    isFetching: idL,
    isError: idE,
  } = useQuery({
    queryKey: ["skuId"],
    queryFn: () => getId("sku"),
  });

  //**************************HANDLERS*********************************/
  // todo : handle all the id later coz it has to be auto incremental
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (!skuNameRef.current.value || !metric || !category)
        throw new Error("All fields are required");

      const sku = {
        sku_id: incrementId(skuId),
        sku_name: skuNameRef.current.value,
        metric: metric,
        category: category,
      };

      // todo : I have to make sure, latest Id and the other respective collection like sales, customer etc ids are in sync

      const { data } = await axiosIn.post("/sku/master", sku);

      const { data: putId } = await axiosIn.put("/latestId", {
        name: "sku",
        id: sku.sku_id,
      });

      toaster.push(toast(data.message, "success"), { placement: "topCenter" });

      window.location.reload();
      // router.push("/sku");

      // skuNameRef.current.value = "";
      // setMetric(() => "");
      // setCategory(() => "");
    } catch (err) {
      toaster.push(toast(err.message), { placement: "topCenter" });
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
            <label htmlFor="skuName">
              SKU NAME <sup>*</sup> :
            </label>
            <input ref={skuNameRef} type="text" id="skuName" />
          </div>

          <div>
            <label>
              Category <sup>*</sup> :
            </label>
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
            <label>
              Metric <sup>*</sup>
            </label>
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
