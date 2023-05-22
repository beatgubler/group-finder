import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import Home from "./pages/home.js";
import Login from "./pages/login.js";
import { Provider } from "react-redux";
import { store } from "./store.js";
import Group from "./pages/group.js";
import Message from "./pages/message.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: "Error",
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "group",
        children: [
          {
            path: "add",
            element: <Group />,
          },
          {
            path: ":id",
            children: [
              {
                path: "edit",
                element: <Group />,
              },
              {
                path: "message",
                element: <Message />,
              },
            ],
          },
        ],
      },

      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
