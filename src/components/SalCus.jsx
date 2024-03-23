export default function SalCus() {
  const inDiv = "flex gap-4 justify-around";
  const outDiv = "w-full flex flex-col gap-2";
  const p1 = "border border-black px-4";
  return (
    <section className="flex justify-between gap-3 h-36 p-5 bg-white">
      <div className="w-full flex flex-col gap-2">
        <div className="flex gap-4 justify-around">
          <h4>Sales Order</h4>
          <p className="border border-black px-4">NGSAL12</p>
        </div>

        <div className={`${inDiv}`}>
          <h4>Customer ID</h4>
          <p className={p1}>NGCUS123</p>
        </div>

        <div className={`${inDiv}`}>
          <h4>Customer</h4>
          <p className={p1}>John Doe</p>
        </div>
      </div>
      {/* //* ---------------XXXXX---------------------/ */}
      <div className={outDiv}>
        <div className={`${inDiv}`}>
          <h4>Order Date</h4>
          <p className={p1}>2021-01-01</p>
        </div>

        <div className={`${inDiv}`}>
          <h4>Delivery Date</h4>
          <p className={p1}>2021-01-02</p>
        </div>

        <div>
          <h4>Delivery Address</h4>
          <p>123 Main St, Springfield, IL 62701</p>
        </div>
      </div>
    </section>
  );
}
