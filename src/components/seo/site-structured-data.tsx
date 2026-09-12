import { getSiteStructuredData } from "@/lib/structured-data";

export default function SiteStructuredData() {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getSiteStructuredData()) }} />;
}
