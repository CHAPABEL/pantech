import { Award, Building2 } from "lucide-react";
import { resolveAssetUrl } from "../../../../../services/assets";
import CertificateSlider from "../CertificateSlider/CertificateSlider";
import styles from "./PartnerContent.module.scss";

type PartnerContentData = {
  name: string;
  description: string;
  logo: string;
  certificates: string[];
  achievement: string;
};

type Props = {
  partner: PartnerContentData;
};

function PartnerContent({ partner }: Props) {
  const hasCertificates = partner.certificates.length > 0;
  const hasBottomRow = partner.achievement || hasCertificates;

  return (
    <div className={styles.partner_conteiner}>
      <div className={styles.conteiner_left}>
        {partner.logo ? (
          <img
            src={resolveAssetUrl(partner.logo)}
            className={styles.left_img}
            alt={`Логотип ${partner.name}`}
          />
        ) : (
          <Building2 className={styles.left_placeholder} size={72} strokeWidth={1.2} />
        )}
      </div>

      <div className={styles.conteiner_right}>
        <div className={styles.textCon_top}>
          <span className={styles.main_mainText}>{partner.name}</span>
          {partner.description ? (
            <span className={styles.top_disc}>{partner.description}</span>
          ) : null}
        </div>

        {hasBottomRow ? (
          <div className={styles.bottomRow}>
            {partner.achievement ? (
              <div className={styles.achievement}>
                <div className={styles.achievement_label}>
                  <Award size={22} strokeWidth={2} />
                  <span>Достижение</span>
                </div>
                <p className={styles.achievement_text}>{partner.achievement}</p>
              </div>
            ) : null}

            {hasCertificates ? (
              <div className={styles.certificateWrap}>
                <CertificateSlider
                  certificates={partner.certificates}
                  name={partner.name}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default PartnerContent;
export type { PartnerContentData };
