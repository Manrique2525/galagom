import type { Metadata } from "next";
import { siteConfig } from "@/data/site";

export function createPageMetadata(title: string, description: string): Metadata {
  return { title, description, alternates: { canonical: siteConfig.url } };
}
