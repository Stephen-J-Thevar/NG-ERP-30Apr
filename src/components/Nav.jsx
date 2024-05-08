import Link from "next/link";

export default function Nav() {
  return (
    <nav>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/sku">Products</Link>
        </li>
        <li>
          <Link href="/sales">Sales</Link>
        </li>
        <li>
          <Link href="/customer">Customer</Link>
        </li>
        <li>
          <Link href="/grn">GRN</Link>
        </li>
      </ul>
    </nav>
  );
}
