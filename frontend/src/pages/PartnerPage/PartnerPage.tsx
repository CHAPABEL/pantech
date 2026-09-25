import { Award, Building2 } from "lucide-react";
import { useParams } from "react-router-dom";
import Seo from "../../components/Seo/Seo";
import { useApiList } from "../../hooks/useApiList";
import { resolveAssetUrl } from "../../services/assets";
import type { PartnerItem } from "../../services/types";
import CertificateSlider from "../App/components/Partners/CertificateSlider/CertificateSlider";
import PartnersPageHeader from "../PartnersPage/PartnersPageHeader";
import { FALLBACK_PARTNERS } from "../PartnersPage/partnersUtils";
import styles from "./PartnerPage.module.scss";

function PartnerPage() {
  const { id } = useParams<{ id: string }>();
  const raw = useApiList<PartnerItem>("/partners", FALLBACK_PARTNERS);

  const partner = raw.find((p) => String(p.id) === id);

  if (!partner) {
    return (
      <div className={styles.page}>
        <PartnersPageHeader />
        <main className={styles.main}>
          <p className={styles.notFound}>Партнёр не найден.</p>
        </main>
      </div>
    );
  }

  const certificates = partner.certificates || [];

  return (
    <div className={styles.page}>
      <Seo
        title={partner.title}
        description={
          partner.description || `${partner.title} — партнёр Pantech.`
        }
        path={`/partners/${partner.id}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Главная",
              item:
                typeof window !== "undefined"
                  ? `${window.location.origin}/`
                  : "/",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "Партнёры",
              item:
                typeof window !== "undefined"
                  ? `${window.location.origin}/partners`
                  : "/partners",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: partner.title,
            },
          ],
        }}
      />

      <PartnersPageHeader />

      <main className={styles.main}>
        <nav className={styles.breadcrumbs} aria-label="Хлебные крошки">
          <a href="/" className={styles.breadcrumbLink}>
            Главная
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <a href="/partners" className={styles.breadcrumbLink}>
            Партнёры
          </a>
          <span className={styles.breadcrumbSep}>/</span>
          <span>{partner.title}</span>
        </nav>

        <section className={styles.profile}>
          {partner.image_path ? (
            <img
              src={resolveAssetUrl(partner.image_path)}
              alt={`Логотип ${partner.title}`}
              className={styles.logo}
            />
          ) : (
            <Building2 className={styles.logoPlaceholder} size={56} strokeWidth={1.2} />
          )}

          <h1 className={styles.title}>{partner.title}</h1>

          {partner.description ? (
            <p className={styles.description}>{partner.description}</p>
          ) : null}

          {partner.full_description ? (
            <div className={styles.fullDescription}>
              <h2 className={styles.sectionTitle}>О партнёре</h2>
              {partner.full_description
                .split(/\n\s*\n/)
                .map((para) => para.trim())
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className={styles.paragraph}>
                    {para}
                  </p>
                ))}
            </div>
          ) : null}

          {partner.achievement ? (
            <div className={styles.achievement}>
              <div className={styles.achievementLabel}>
                <Award size={20} strokeWidth={2} />
                <span>Достижение</span>
              </div>
              <p className={styles.achievementText}>{partner.achievement}</p>
            </div>
          ) : null}
        </section>

        {certificates.length > 0 && (
          <section className={styles.certificatesSection}>
            <h2 className={styles.certificatesTitle}>Сертификаты</h2>
            <CertificateSlider certificates={certificates} name={partner.title} />
          </section>
        )}
      </main>
    </div>
  );
}

export default PartnerPage;
