import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import styles from "./MobileMenu.module.scss";

export type MobileMenuLink = { label: string; href: string };

type Props = {
  links: MobileMenuLink[];
  email: string;
  contactLabel: string;
  onContact?: () => void;
  contactHref?: string;
  activeHref?: string;
};

function MobileMenu({
  links,
  email,
  contactLabel,
  onContact,
  contactHref,
  activeHref,
}: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <div className={`${styles.root} ${open ? styles.open : ""}`}>
      <button
        type="button"
        className={styles.toggle}
        aria-label={open ? "Закрыть меню" : "Открыть меню"}
        aria-expanded={open}
        aria-controls="mobile-menu-panel"
        onClick={() => setOpen((v) => !v)}
      >
        <Menu className={`${styles.icon} ${styles.iconMenu}`} size={22} />
        <X className={`${styles.icon} ${styles.iconClose}`} size={22} />
      </button>

      <div className={styles.backdrop} onClick={close} aria-hidden="true" />

      <nav
        id="mobile-menu-panel"
        className={styles.panel}
        aria-label="Основная навигация"
        aria-hidden={!open}
      >
        <img
          src="/images/Logo2.svg"
          alt="Pantech"
          className={styles.logo}
          width={44}
          height={44}
        />
        <ul className={styles.list}>
          {links.map((link, i) => (
            <li
              key={link.href + link.label}
              className={styles.item}
              style={{ "--i": i } as React.CSSProperties}
            >
              <a
                href={link.href}
                className={`${styles.link} ${
                  activeHref === link.href ? styles.linkActive : ""
                }`}
                tabIndex={open ? 0 : -1}
                onClick={close}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div
          className={styles.footer}
          style={{ "--i": links.length } as React.CSSProperties}
        >
          <a
            href={`mailto:${email}`}
            className={styles.email}
            tabIndex={open ? 0 : -1}
          >
            {email}
          </a>
          {contactHref ? (
            <a
              href={contactHref}
              className={styles.cta}
              tabIndex={open ? 0 : -1}
              onClick={close}
            >
              {contactLabel}
            </a>
          ) : (
            <button
              type="button"
              className={styles.cta}
              tabIndex={open ? 0 : -1}
              onClick={() => {
                close();
                onContact?.();
              }}
            >
              {contactLabel}
            </button>
          )}
        </div>
      </nav>
    </div>
  );
}

export default MobileMenu;
