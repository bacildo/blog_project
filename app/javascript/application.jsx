import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PostsLists from "./pages/PostsList.jsx";
import "../../index.css"

const router = createBrowserRouter([
  
  {
    path: "/", 
    element: <Navigate to="/login"/>, 
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/users",
    element: <Register />,
  },
  {
    path: "/posts",
    element: <PostsLists />
  }
]);

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");

  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    );
  }
});
