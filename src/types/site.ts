export type NavItem = { label: string; href: string };

export type PhoneConfig = {
  local: string;
  display: string;
  international: string;
  telHref: string;
};

export type WhatsAppConfig = {
  phone: string;
  message: string;
};

export type SiteConfig = {
  name: string;
  shortName: string;
  description: string;
  url: string;
  phone: PhoneConfig;
  location: string;
  email?: string;
  navigation: NavItem[];
  whatsapp: WhatsAppConfig;
};
