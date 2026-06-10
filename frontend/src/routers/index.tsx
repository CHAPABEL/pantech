import { createBrowserRouter } from "react-router-dom";
import App from "../pages/App/App";
import Auth from "../pages/Auth/Auth";
import Admin from "../pages/Admin/Admin";
import Dashboard from "../pages/Admin/pages/Dashboard/Dashboard";
import Mail from "../pages/Admin/pages/Mail/Mail";
import ContentEditor from "../pages/Admin/pages/ContentEditor/ContentEditor";
import ProtectedRoute from "../components/ProtectedRoute";
import PartnersPage from "../pages/PartnersPage/PartnersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/partners",
    element: <PartnersPage />,
  },
  {
    path: "/in",
    element: <Auth />,
  },
  {
    path: "/a",
    element: (
      <ProtectedRoute>
        <Admin />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "mail", element: <Mail /> },
      { path: "content", element: <ContentEditor /> },
    ],
  },
]);

export default router;
