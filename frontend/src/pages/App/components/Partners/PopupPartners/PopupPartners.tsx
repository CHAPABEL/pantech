import { useEffect, useState } from "react";
import { X } from "lucide-react";
import PartnerContent, {
  type PartnerContentData,
} from "../PartnerContent/PartnerContent";
import styles from "./PopupPartners.module.scss";

type Props = {
  partner: PartnerContentData;
  onClose: () => void;
};

function PopupPartners({ partner, onClose }: Props) {
  const [closing, setClosing] = useState(false);

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
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div
      className={`${styles.app_partner} ${closing ? styles.hide : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={partner.name}
      onClick={handleClose}
    >
      <div className={styles.popup_wrap} onClick={(e) => e.stopPropagation()}>
        <X className={styles.close_btn} size="24px" onClick={handleClose} />
        <PartnerContent partner={partner} />
      </div>
    </div>
  );
}

export default PopupPartners;
export type { PartnerContentData as PartnerPopupData };
