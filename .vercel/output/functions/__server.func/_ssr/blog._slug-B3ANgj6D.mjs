import { I as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as posts } from "./blog-data-3DVoSlEv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/blog._slug-B3ANgj6D.js
var $$splitComponentImporter = () => import("./blog._slug-C1O2aeaI.mjs");
var $$splitNotFoundComponentImporter = () => import("./blog._slug-DXKaDkGw.mjs");
var Route = createFileRoute("/blog/$slug")({
	loader: ({ params }) => {
		const post = posts.find((p) => p.slug === params.slug);
		if (!post) throw notFound();
		return { post };
	},
	head: ({ loaderData }) => ({
		meta: loaderData ? [
			{ title: `${loaderData.post.title} — OFC360` },
			{
				name: "description",
				content: loaderData.post.excerpt
			},
			{
				property: "og:title",
				content: loaderData.post.title
			},
			{
				property: "og:description",
				content: loaderData.post.excerpt
			},
			{
				property: "og:type",
				content: "article"
			},
			{
				property: "og:url",
				content: `/blog/${loaderData.post.slug}`
			}
		] : [],
		links: loaderData ? [{
			rel: "canonical",
			href: `/blog/${loaderData.post.slug}`
		}] : []
	}),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
