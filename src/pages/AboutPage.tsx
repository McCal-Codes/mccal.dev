import { SITE } from '@/content/site';
import { useDocumentMeta } from '@/lib/useDocumentTitle';
import styles from './PageShell.module.css';

const LINKS = [
  { label: 'Resume (PDF)', href: SITE.resume },
  { label: 'Photography portfolio', href: SITE.portfolio },
  { label: 'GitHub', href: SITE.github },
  { label: 'Support on Ko-fi', href: SITE.kofi },
] as const;

export default function AboutPage() {
  useDocumentMeta('About', SITE.description);

  return (
    <>
      <header className={`${styles.header} grid-backdrop`}>
        <div className="shell">
          <p className={`${styles.eyebrow} meta`}>About</p>
          <h1 className={styles.title}>{SITE.person}</h1>
          <p className={styles.role}>{SITE.role}</p>
          <p className={styles.lede}>{SITE.intro}</p>
        </div>
      </header>

      <div className={`${styles.body} shell`}>
        <ul className={styles.links}>
          {LINKS.map((link) => (
            <li key={link.label}>
              <a className={styles.link} href={link.href} rel="noreferrer" target="_blank">
                {link.label}
                <span aria-hidden="true"> ↗</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
