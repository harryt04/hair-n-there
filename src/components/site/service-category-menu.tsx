import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  Heart,
  Palette,
  Scissors,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import styles from "./service-category-menu.module.css";

const categories = [
  {
    id: "haircuts",
    title: "Haircuts",
    copy: "Fresh looks for the whole crew.",
    icon: Scissors,
  },
  {
    id: "color",
    title: "Color Magic",
    copy: "From touch-ups to transformations.",
    icon: Palette,
  },
  {
    id: "styling",
    title: "Styling",
    copy: "Blowouts, braids, and special occasions.",
    icon: Sparkles,
  },
  {
    id: "extensions",
    title: "Extensions",
    copy: "Extra length, volume, and a little hair love.",
    icon: Heart,
  },
];

export function ServiceCategoryMenu({
  onServicesPage = false,
}: {
  onServicesPage?: boolean;
}) {
  const prefix = onServicesPage ? "" : "/services";
  const Arrow = onServicesPage ? ArrowDown : ArrowUpRight;

  return (
    <nav aria-label="Service categories" className={styles.menu}>
      <div className={styles.grid}>
        {categories.map(({ id, title, copy, icon: Icon }) => (
          <Link key={id} href={`${prefix}#${id}`} className={styles.link}>
            <Card className={`ring-0 shadow-none ${styles.card}`}>
              <CardContent className={styles.content}>
                <Icon
                  className={styles.icon}
                  aria-hidden="true"
                  strokeWidth={1.6}
                />
                <span className={styles.title}>{title}</span>
                <span className={styles.copy}>{copy}</span>
                <span className={styles.action}>
                  Explore <Arrow aria-hidden="true" size={16} />
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      {onServicesPage && (
        <Link
          href="#family-hair-days"
          className={`${styles.link} ${styles.family}`}
        >
          <Users aria-hidden="true" size={28} strokeWidth={1.6} />
          <span>
            <span className={styles.title}>Family Hair Days</span>
            <span className={styles.copy}>
              One happy household. Explore the bundles.
            </span>
          </span>
          <ArrowDown aria-hidden="true" size={20} />
        </Link>
      )}
    </nav>
  );
}
