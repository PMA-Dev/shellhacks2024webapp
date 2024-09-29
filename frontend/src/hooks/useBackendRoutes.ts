// src/hooks/useBackendRoutes.ts

import { useState } from "react";

export interface BackendRoute {
  id: string;
  path: string;
  method: string;
  middlewares: string[];
}


export const useBackendRoutes = () => {
  const [routes, setRoutes] = useState<BackendRoute[]>([
    // Sample initial data
    {
      id: "1",
      path: "/api/users",
      method: "GET",
      middlewares: ["authMiddleware"],
    },
    {
      id: "2",
      path: "/api/posts",
      method: "POST",
      middlewares: ["authMiddleware", "validatePostMiddleware"],
    },
  ]);

  const addRoute = (route: BackendRoute) => {
    // TODO: Integrate with backend to add a new route
    setRoutes([...routes, route]);
  };

  const updateRoute = (updatedRoute: BackendRoute) => {
    // TODO: Integrate with backend to update the route
    setRoutes(
      routes.map((route) =>
        route.id === updatedRoute.id ? updatedRoute : route
      )
    );
  };

  const deleteRoute = (routeId: string) => {
    // TODO: Integrate with backend to delete the route
    setRoutes(routes.filter((route) => route.id !== routeId));
  };

  return {
    routes,
    addRoute,
    updateRoute,
    deleteRoute,
  };
};
