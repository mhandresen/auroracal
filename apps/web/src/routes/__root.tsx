import { createRootRoute, Outlet } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  document.documentElement.classList.add("dark");
  return (
    <>
      <Outlet />
    </>
  );
}
