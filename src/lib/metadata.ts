import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export const socialImage = {
  url: "/images/seo/og-galagom.jpg",
  width: 1200,
  height: 630,
  alt: "GALAGOM Soluciones Logísticas, transporte y logística en Cancún con cobertura nacional",
};

export function createPageMetadata(title: string, description: string, canonical = "/"): Metadata {
  const canonicalUrl = canonical === "/" ? `${siteConfig.url}/` : canonical;
  return {
    title: { absolute: `${title} | ${siteConfig.shortName}` },
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      locale: "es_MX",
      url: canonicalUrl,
      siteName: siteConfig.shortName,
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [socialImage],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.shortName}`,
      description,
      images: [socialImage],
    },
  };
}
