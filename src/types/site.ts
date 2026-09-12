export type NavItem = { label: string; href: string };

export type SiteConfig = {
  name: string;
  shortName: string;
  description: string;
  url: string;
  phone: string;
  phoneHref: string;
  location: string;
  email?: string;
  navigation: NavItem[];
};
