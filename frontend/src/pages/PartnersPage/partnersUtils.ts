import type { PartnerItem } from "../../services/types";

export function sortPartners(items: PartnerItem[]): PartnerItem[] {
  return [...items].sort((a, b) =>
    a.title.localeCompare(b.title, "ru", { sensitivity: "base" }),
  );
}

export const FALLBACK_PARTNERS: PartnerItem[] = [
  {
    id: 1,
    title: "Google",
    description:
      "Корпоративные облачные решения и интеграция сервисов Google Workspace.",
    image_path: "https://cdn.simpleicons.org/google/4285F4",
    position: 0,
    is_published: true,
  },
  {
    id: 2,
    title: "Microsoft",
    description:
      "Внедрение платформ Azure и корпоративной экосистемы Microsoft 365.",
    image_path: "images/partners/microsoft.svg",
    position: 1,
    is_published: true,
  },
  {
    id: 3,
    title: "Amazon Web Services",
    description:
      "Построение масштабируемой облачной инфраструктуры на базе AWS.",
    image_path: "images/partners/aws.svg",
    position: 2,
    is_published: true,
  },
  {
    id: 4,
    title: "IBM",
    description:
      "Консалтинг и разработка enterprise-решений для крупного бизнеса.",
    image_path: "images/partners/ibm.svg",
    position: 3,
    is_published: true,
  },
  {
    id: 5,
    title: "Oracle",
    description:
      "Системы управления данными и корпоративные бизнес-приложения.",
    image_path: "images/partners/oracle.svg",
    position: 4,
    is_published: true,
  },
  {
    id: 6,
    title: "SAP",
    description: "ERP-интеграции и автоматизация ключевых бизнес-процессов.",
    image_path: "https://cdn.simpleicons.org/sap/0FAAFF",
    position: 5,
    is_published: true,
  },
  {
    id: 7,
    title: "Intel",
    description:
      "Аппаратные платформы и оптимизация высоконагруженных систем.",
    image_path: "https://cdn.simpleicons.org/intel/0071C5",
    position: 6,
    is_published: true,
  },
  {
    id: 8,
    title: "Samsung",
    description:
      "Технологические партнёрства в области IoT и мобильных решений.",
    image_path: "https://cdn.simpleicons.org/samsung/1428A0",
    position: 7,
    is_published: true,
  },
];
