import type { MetadataRoute } from "next";

// Only the public catalogue is indexed; personal areas stay out of search engines
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/doctors", "/about"],
      disallow: ["/auth", "/profile", "/dashboard", "/appointments", "/wishlist", "/chat", "/protocol", "/admin", "/clinic/", "/records", "/ai-companion", "/api"],
    },
  };
}
