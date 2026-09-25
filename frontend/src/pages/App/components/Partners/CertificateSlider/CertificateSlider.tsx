import { useState } from "react";
import { resolveAssetUrl } from "../../../../../services/assets";
import styles from "./CertificateSlider.module.scss";

type Props = {
  certificates: string[];
  name: string;
};

function CertificateSlider({ certificates, name }: Props) {
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (certificates.length === 0) return null;

  const activePath = certificates[Math.min(active, certificates.length - 1)];
  const preventContextMenu = (e: React.MouseEvent) => e.preventDefault();

  return (
    <div className={styles.slider}>
      <img
        src={resolveAssetUrl(activePath)}
        className={styles.image}
        alt={`Сертификат ${name}${certificates.length > 1 ? ` ${active + 1}` : ""}`}
        onClick={() => setLightboxOpen(true)}
        onContextMenu={preventContextMenu}
      />

      {certificates.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Сертификаты">
          {certificates.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Сертификат ${i + 1}`}
              className={`${styles.dot} ${i === active ? styles.dotActive : ""}`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      )}

      <div
        className={`${styles.lightbox} ${lightboxOpen ? styles.lightbox_open : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          setLightboxOpen(false);
        }}
      >
        <img
          src={resolveAssetUrl(activePath)}
          className={styles.lightbox_img}
          alt={`Сертификат ${name}`}
          onContextMenu={preventContextMenu}
        />
      </div>
    </div>
  );
}

export default CertificateSlider;
