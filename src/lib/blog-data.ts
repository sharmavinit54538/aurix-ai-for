export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  cover: string;
  content: string[];
};

export const posts: Post[] = [
  {
    slug: "shipping-faster-with-aurix",
    title: "How modern teams ship 3x faster with Aurix",
    excerpt: "Inside the workflow changes that helped 500+ engineering teams cut their release cycle in half.",
    category: "Product",
    author: "Elena Rivera",
    authorRole: "Head of Product",
    date: "Jun 12, 2026",
    readTime: "6 min read",
    cover: "linear-gradient(135deg, oklch(0.6 0.2 285), oklch(0.7 0.18 320))",
    content: [
      "The biggest predictor of how fast a team ships isn't headcount or tooling budget — it's how little friction sits between an idea and its first shipped iteration.",
      "Over the past year, we studied how the fastest teams using Aurix structure their work. Three patterns kept showing up: tight loops, fewer handoffs, and a shared source of truth that engineers actually trust.",
      "The teams who internalized this shipped roughly three times faster than the median — without working longer hours. The product simply got out of their way.",
    ],
  },
  {
    slug: "design-systems-that-scale",
    title: "Design systems that scale beyond 100 designers",
    excerpt: "Lessons from building a design system used by thousands of product teams worldwide.",
    category: "Design",
    author: "Marcus Chen",
    authorRole: "Principal Designer",
    date: "Jun 02, 2026",
    readTime: "8 min read",
    cover: "linear-gradient(135deg, oklch(0.65 0.18 200), oklch(0.7 0.18 270))",
    content: [
      "Design systems are easy to start and brutal to scale. Once dozens of teams depend on your tokens and components, every change becomes a migration.",
      "We rebuilt our system from the ground up to support contribution at scale. Here's what we learned.",
    ],
  },
  {
    slug: "the-future-of-saas",
    title: "The future of SaaS is composable",
    excerpt: "Why monolithic platforms are losing ground to focused, interoperable tools.",
    category: "Industry",
    author: "Priya Patel",
    authorRole: "CEO",
    date: "May 24, 2026",
    readTime: "5 min read",
    cover: "linear-gradient(135deg, oklch(0.7 0.18 30), oklch(0.7 0.2 350))",
    content: [
      "The SaaS landscape is shifting. The all-in-one suites that dominated the last decade are being unbundled by composable, API-first tools.",
      "This isn't just a product trend — it's a structural change in how companies buy software.",
    ],
  },
  {
    slug: "engineering-culture-remote",
    title: "Building engineering culture in a remote-first world",
    excerpt: "Practical playbooks for high-trust, async-first engineering organizations.",
    category: "Engineering",
    author: "James Okoye",
    authorRole: "VP Engineering",
    date: "May 18, 2026",
    readTime: "7 min read",
    cover: "linear-gradient(135deg, oklch(0.6 0.2 150), oklch(0.7 0.18 220))",
    content: [
      "Remote engineering culture isn't built in all-hands meetings. It's built in the small rituals of daily work.",
    ],
  },
  {
    slug: "ai-in-product-workflows",
    title: "Where AI actually belongs in product workflows",
    excerpt: "A pragmatic look at AI features users want — and the ones they quietly ignore.",
    category: "AI",
    author: "Sara Lindqvist",
    authorRole: "Director of AI",
    date: "May 10, 2026",
    readTime: "9 min read",
    cover: "linear-gradient(135deg, oklch(0.7 0.2 290), oklch(0.72 0.18 340))",
    content: [
      "Every product team is shipping AI features. Most of them won't be used a month after launch.",
      "The features that stick share three properties: they remove a real chore, they're invisible until needed, and they get out of the way the moment you have momentum.",
    ],
  },
  {
    slug: "metrics-that-matter",
    title: "The five metrics every SaaS team should track",
    excerpt: "Cut through dashboard noise with the small set of numbers that actually move the business.",
    category: "Growth",
    author: "Daniel Kim",
    authorRole: "Head of Growth",
    date: "May 02, 2026",
    readTime: "6 min read",
    cover: "linear-gradient(135deg, oklch(0.7 0.18 90), oklch(0.65 0.2 30))",
    content: [
      "Most SaaS dashboards measure dozens of metrics. The teams that grow fastest watch five.",
    ],
  },
];

export const categories = ["All", "Product", "Design", "Engineering", "AI", "Growth", "Industry"];
