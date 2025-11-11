import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App/App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
]);

export default router;
