import type { PartnerItem } from "../../services/types";

export function sortPartners(items: PartnerItem[]): PartnerItem[] {
  return [...items].sort((a, b) =>
    a.title.localeCompare(b.title, "ru", { sensitivity: "base" }),
  );
}
