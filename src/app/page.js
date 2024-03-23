"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Sales from "./Sales";

//* ---------------COMP---------------------/
export default function Home() {
  const [queryClient] = useState(() => new QueryClient());

  //* ---------------JSX---------------------/
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools />
      <Sales />
    </QueryClientProvider>
  );
}

// todo : delete json-server later
