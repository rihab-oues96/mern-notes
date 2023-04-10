import LoadingScreen from "./components/LoadingScreen";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { IRouteItem } from "./types/routes";
import NotFoundPage from "./pages/NotFoundPage";

export const renderRoutes = (routes: IRouteItem[] = []) => (
  <Suspense fallback={<LoadingScreen />}>
    <Routes>
      {routes.map((route, index) => {
        const Component: any = route.component;
        return <Route key={index} path={route.path} element={<Component />} />;
      })}
      <Route path="/*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

const routes: IRouteItem[] = [
  {
    exact: true,
    path: "/",
    component: lazy(() => import("./pages/LoginPage")),
  },

  {
    exact: true,
    path: "/signup",
    component: lazy(() => import("./pages/SignupPage")),
  },

  {
    exact: true,
    path: "/notes",
    component: lazy(() => import("./pages/NotesPage")),
  },
];

export default routes;
