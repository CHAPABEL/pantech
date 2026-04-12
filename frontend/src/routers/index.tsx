import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App/App";
import Auth from "../pages/Auth/Auth";
import Admin from "../pages/Admin/Admin";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/a",
    element: <Admin />,
  },
  {
    path: "/in",
    element: <Auth />,
  },
]);

export default router;
