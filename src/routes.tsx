import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import Article from "./pages/Article";
import NewsEditor from "./pages/admin/NewsEditor";
import VehiclesAdmin from "./pages/admin/Vehicles/VehiclesAdmin";
import Vehicles from "./pages/Vehicles";

export const router = createBrowserRouter([
  { path: "/", Component: Home },
  { path: "*", Component: Home },
  { path: "/noticia/:id", Component: Article },
  { path: "/admin/news/new", Component: NewsEditor },
  { path: "/admin/vehicles/new", Component: VehiclesAdmin },
  { path: "/vehicles", Component: Vehicles },
]);
