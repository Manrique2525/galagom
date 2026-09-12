import { siteConfig } from "@/data/site";

export function getSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": `${siteConfig.url}/#organization`, name: siteConfig.shortName, url: siteConfig.url, telephone: siteConfig.phone, address: { "@type": "PostalAddress", addressLocality: "Cancún", addressRegion: "Quintana Roo", addressCountry: "MX" } },
      { "@type": "WebSite", "@id": `${siteConfig.url}/#website`, url: siteConfig.url, name: siteConfig.name, publisher: { "@id": `${siteConfig.url}/#organization` }, inLanguage: "es-MX" },
    ],
  };
}
