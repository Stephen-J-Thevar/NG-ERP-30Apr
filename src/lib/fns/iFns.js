import { axiosIn } from "../query-provider";

export async function getId(type) {
  try {
    const { data } = await axiosIn.get(`/latestId?name=${type}`);
    return data.latestId.id;
  } catch (err) {
    return { error: "error", message: err.message };
  }
}

//* ---------------XXXX---------------------/
export function incrementId(id) {
  try {
    if (!id) throw new Error("id is not defined");

    const id_arr = id.split("-");
    const type = id_arr[0];
    const num = id_arr[2];
    const current_year = new Date().getFullYear().toString().slice(2);

    const newId = (parseInt(num) + 1).toString().padStart(6, "0");

    const new_id = `${type}-${current_year}-${newId}`;

    return new_id;
  } catch (err) {
    return { error: "error", message: err.message };
  }
}

//* ---------------XXXX---------------------/
export async function catSku(cat) {
  try {
    const { data } = await axiosIn.post("/inventory/catSku", {
      cat,
    });

    return data.listArr;
  } catch (err) {
    console.log(err);
    return { stat: "Error", message: err.message };
  }
}

//* ---------------XXXX---------------------/
export async function categoryList() {
  try {
    const { data } = await axiosIn.get("/inventory/category");

    return data.cat;
  } catch (err) {
    console.log(err);
    return { stat: "Error", message: err.message };
  }
}
