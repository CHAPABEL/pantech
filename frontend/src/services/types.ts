export type ContentEntry = { value: string; type: "text" | "html" | "json" };
export type ContentMap = Record<string, ContentEntry>;

export type CardItem = {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
  stack: string[];
  is_clickable: boolean;
  popup_content_key: string | null;
  position: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ServiceItem = {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
  position: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ProjectItem = ServiceItem;

export type PartnerItem = {
  id: number;
  title: string;
  description: string;
  image_path: string | null;
  position: number;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
};

export type AdminContentItem = {
  key: string;
  value: string;
  value_type: "text" | "html" | "json";
};

export type MessageItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  direction: string | null;
  about: string;
  file_path: string | null;
  status: string;
  error: string | null;
  created_at: string;
};

export type StatsResponse = {
  messages_total: number;
  messages_today: number;
  visitors_today: number;
  visitors_7d: number;
  visitors_30d: number;
  page_views_today: number;
};
