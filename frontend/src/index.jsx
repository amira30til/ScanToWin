// REACT
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "@/i18n";

// REACT QUERY
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// CHAKRA PROVIDER
import { ChakraProvider } from "@chakra-ui/react";
import themes from "@/theme";

import App from "@/App";

import "@/index.css";
import "@/schemas/yupLocale";
const router = createBrowserRouter([
  {
    path: "*",
    element: <App />,
  },
]);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <ChakraProvider theme={themes}>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </ChakraProvider>,
);
