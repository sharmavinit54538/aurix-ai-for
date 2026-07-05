import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Aurix" },
      { name: "description", content: "Stories, product updates, and ideas from the Aurix team." },
      { property: "og:title", content: "Blog — Aurix" },
      { property: "og:description", content: "Stories and ideas from the team building Aurix." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: () => <Outlet />,
});
