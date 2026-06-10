import { Helmet } from "react-helmet";

const SITE_NAME = "Pantech";
const DEFAULT_OG_IMAGE = "/images/Logo2.svg";

type JsonLd = Record<string, unknown> | Record<string, unknown>[];

type SeoProps = {
  title: string;
  description: string;
  /** Путь для canonical, например `/` или `/partners` */
  path?: string;
  noindex?: boolean;
  jsonLd?: JsonLd;
};

function siteOrigin(): string {
  const fromEnv = import.meta.env.VITE_SITE_URL as string | undefined;
  if (fromEnv) return fromEnv.replace(/\/$/, "");
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

function pageTitle(title: string): string {
  return title.includes(SITE_NAME) ? title : `${title} — ${SITE_NAME}`;
}

export default function Seo({
  title,
  description,
  path = "/",
  noindex = false,
  jsonLd,
}: SeoProps) {
  const origin = siteOrigin();
  const fullTitle = pageTitle(title);
  const canonical = origin && path ? `${origin}${path}` : undefined;
  const ogImage = origin ? `${origin}${DEFAULT_OG_IMAGE}` : DEFAULT_OG_IMAGE;

  return (
    <Helmet htmlAttributes={{ lang: "ru" }}>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical ? <link rel="canonical" href={canonical} /> : null}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      {canonical ? <meta property="og:url" content={canonical} /> : null}
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="ru_RU" />

      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {jsonLd ? (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(jsonLd) ? jsonLd : jsonLd,
          )}
        </script>
      ) : null}
    </Helmet>
  );
}
