import { useEffect, useState } from "react";
import { Award, Building2, X } from "lucide-react";
import { resolveAssetUrl } from "../../../../../services/assets";
import styles from "./PopupPartners.module.scss";

type PartnerPopupData = {
  name: string;
  description: string;
  logo: string;
  certificate: string;
  achievement: string;
};

type Props = {
  partner: PartnerPopupData;
  onClose: () => void;
};

function PopupPartners({ partner, onClose }: Props) {
  const [closing, setClosing] = useState(false);
  const [certificateOpen, setCertificateOpen] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 300);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (certificateOpen) setCertificateOpen(false);
      else handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [certificateOpen]);

  const preventContextMenu = (e: React.MouseEvent) => e.preventDefault();

  const hasBottomRow = partner.achievement || partner.certificate;

  return (
    <div
      className={`${styles.app_partner} ${closing ? styles.hide : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="partner-popup-title"
      onClick={handleClose}
    >
      <div className={styles.partner_conteiner} onClick={(e) => e.stopPropagation()}>
        <X className={styles.close_btn} size="24px" onClick={handleClose} />

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
            <div className={styles.top_main}>
              <span id="partner-popup-title" className={styles.main_mainText}>
                {partner.name}
              </span>
            </div>
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
                  <p className={styles.achievement_text}>
                    {partner.achievement}
                  </p>
                </div>
              ) : null}
              {partner.certificate ? (
                <img
                  src={resolveAssetUrl(partner.certificate)}
                  className={styles.certificate_img}
                  alt={`Сертификат ${partner.name}`}
                  onClick={() => setCertificateOpen(true)}
                  onContextMenu={preventContextMenu}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {partner.certificate && (
        <div
          className={`${styles.lightbox} ${certificateOpen ? styles.lightbox_open : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setCertificateOpen(false);
          }}
        >
          <img
            src={resolveAssetUrl(partner.certificate)}
            className={styles.lightbox_img}
            alt={`Сертификат ${partner.name}`}
            onContextMenu={preventContextMenu}
          />
        </div>
      )}
    </div>
  );
}

export default PopupPartners;
export type { PartnerPopupData };
