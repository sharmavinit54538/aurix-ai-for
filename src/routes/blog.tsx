import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — OFC360" },
      { name: "description", content: "Stories, product updates, and ideas from the OFC360 team." },
      { property: "og:title", content: "Blog — OFC360" },
      { property: "og:description", content: "Stories and ideas from the team building OFC360." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: () => <Outlet />,
});
