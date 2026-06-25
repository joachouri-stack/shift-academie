import Link from "next/link";
import styles from "./Button.module.css";

type Variant = "primary" | "accent" | "gold" | "outline" | "ghost" | "light";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  className?: string;
};

type AsLink = CommonProps & {
  href: string;
  external?: boolean;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className">;

type AsButton = CommonProps & {
  href?: undefined;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

type ButtonProps = AsLink | AsButton;

export default function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    arrow = false,
    fullWidth = false,
    children,
    className = "",
  } = props;

  const cls = [
    styles.btn,
    styles[variant],
    styles[size],
    fullWidth ? styles.full : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow && (
        <span className={styles.arrow} aria-hidden="true">
          →
        </span>
      )}
    </>
  );

  if (props.href !== undefined) {
    const { href, external, variant: _v, size: _s, arrow: _a, fullWidth: _f, children: _c, className: _cl, ...rest } =
      props as AsLink;
    if (external) {
      return (
        <a
          href={href}
          className={cls}
          target="_blank"
          rel="noopener noreferrer"
          {...rest}
        >
          {inner}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }

  const { variant: _v, size: _s, arrow: _a, fullWidth: _f, children: _c, className: _cl, href: _h, ...rest } =
    props as AsButton;
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}
