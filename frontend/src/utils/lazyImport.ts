import { ComponentType } from "react";

export const pageLoader = (
  loadComponent: () => Promise<{ default: ComponentType<HTMLBodyElement> }>
) => {
  return (): Promise<{ default: ComponentType<HTMLBodyElement> }> =>
    new Promise((resolve, reject) => {
      loadComponent()
        .then((module) => resolve(module))
        .catch((error: object) => {
          reject(error);
        });
    });
};
