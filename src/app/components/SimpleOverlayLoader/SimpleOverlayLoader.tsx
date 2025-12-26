import clsx from "clsx";
import styles from "./SimpleOverlayLoader.module.scss";

type OverlayLoaderProps = {
  isLoading: boolean;
  className?: string;
  label?: string;
};

export default function OverlayLoader({
  isLoading,
  className,
  label = "Loading",
}: OverlayLoaderProps) {
  if (!isLoading) return null;

  return (
    <div
      className={clsx(styles.loader, className)}
      role="status"
      aria-label={label}
    >
      <div className={styles.loader__spinner} />
    </div>
  );
}