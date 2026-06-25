import styles from "./Badge.module.css";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "dark" | "gold" | "accent";
  icon?: boolean;
};

export default function Badge({
  children,
  variant = "default",
  icon = true,
}: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>
      {icon && (
        <svg
          className={styles.check}
          viewBox="0 0 16 16"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            d="M3.5 8.5l3 3 6-7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {children}
    </span>
  );
}

export function BadgeRow({
  items,
  variant,
}: {
  items: readonly string[];
  variant?: BadgeProps["variant"];
}) {
  return (
    <ul className={styles.row}>
      {items.map((item) => (
        <li key={item}>
          <Badge variant={variant}>{item}</Badge>
        </li>
      ))}
    </ul>
  );
}
