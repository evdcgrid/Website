import { useEffect } from "react";

const SITE_NAME = "EVDCGRID";
const SITE_URL = "https://evdcgrid.pt";
const DEFAULT_IMAGE =
  "https://storage.googleapis.com/gpt-engineer-file-uploads/LUUzPPXhtnVRPBrws57FVLv6K4T2/social-images/social-1774698623137-EVDCGrid.webp";

type SeoProps = {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  structuredData?: Record<string, unknown> | Record<string, unknown>[];
};

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  const selector = `meta[${attribute}="${key}"]`;
  let element = document.head.querySelector<HTMLMetaElement>(selector);

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
}

function upsertLink(rel: string, href: string) {
  let element = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);

  if (!element) {
    element = document.createElement("link");
    element.setAttribute("rel", rel);
    document.head.appendChild(element);
  }

  element.setAttribute("href", href);
}

function upsertStructuredData(data?: Record<string, unknown> | Record<string, unknown>[]) {
  const existing = document.head.querySelector<HTMLScriptElement>('script[data-seo="structured-data"]');

  if (!data) {
    existing?.remove();
    return;
  }

  const scriptContent = JSON.stringify(data);

  if (existing) {
    existing.textContent = scriptContent;
    return;
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.dataset.seo = "structured-data";
  script.textContent = scriptContent;
  document.head.appendChild(script);
}

const Seo = ({
  title,
  description,
  path = "/",
  image = DEFAULT_IMAGE,
  noindex = false,
  structuredData,
}: SeoProps) => {
  useEffect(() => {
    const canonicalPath = path.startsWith("/") ? path : `/${path}`;
    const canonicalUrl = new URL(canonicalPath, SITE_URL).toString();
    const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
    const robots = noindex ? "noindex,nofollow" : "index,follow";

    document.title = fullTitle;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", robots);
    upsertMeta("name", "author", SITE_NAME);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", canonicalUrl);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
    upsertLink("canonical", canonicalUrl);
    upsertStructuredData(structuredData);
  }, [description, image, noindex, path, structuredData, title]);

  return null;
};

export { SITE_NAME, SITE_URL };
export default Seo;