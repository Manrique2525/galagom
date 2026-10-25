import { siteConfig } from "@/data/site";

export function getSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.url}/#organization`,
        name: siteConfig.shortName,
        url: `${siteConfig.url}/`,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.url}/images/brand/galagom-logo-footer.png`,
          width: 350,
          height: 257,
        },
        image: `${siteConfig.url}/images/seo/og-galagom.jpg`,
        description: siteConfig.description,
        telephone: siteConfig.phone.international,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Cancún",
          addressRegion: "Quintana Roo",
          addressCountry: "MX",
        },
        areaServed: { "@type": "Country", name: "Mexico" },
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.url}/#website`,
        url: `${siteConfig.url}/`,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { "@id": `${siteConfig.url}/#organization` },
        inLanguage: "es-MX",
      },
    ],
  };
}
