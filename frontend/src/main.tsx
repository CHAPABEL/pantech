import React from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./main.scss";
import router from "./routers/index";
import { AuthProvider } from "./contexts/AuthContext";
import { ContentProvider } from "./contexts/ContentContext";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <ContentProvider>
        <RouterProvider router={router} />
      </ContentProvider>
    </AuthProvider>
  </React.StrictMode>,
);
