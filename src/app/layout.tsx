import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import SiteFooter from "@/components/layout/site-footer";
import SiteHeader from "@/components/layout/site-header";
import SkipLink from "@/components/layout/skip-link";
import { siteConfig } from "@/data/site";
import "./globals.css";

const manrope = Manrope({ variable: "--font-manrope", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.name, template: `%s | ${siteConfig.shortName}` },
  description: siteConfig.description,
  applicationName: siteConfig.shortName,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "es_MX", url: "/", siteName: siteConfig.shortName, title: siteConfig.name, description: siteConfig.description },
  twitter: { card: "summary_large_image", title: siteConfig.name, description: siteConfig.description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="es" className={`${manrope.variable} h-full antialiased`}>
    <body className="min-h-full bg-surface text-text">
      <SkipLink />
      <SiteHeader />
      <main id="main-content">{children}</main>
      <SiteFooter />
    </body>
  </html>;
}
