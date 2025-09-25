import { ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
  footer?: ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  loading?: boolean;
  selected?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export default function Card({
  title,
  subtitle,
  children,
  footer,
  variant = 'default',
  loading = false,
  selected = false,
  disabled = false,
  className = '',
  onClick,
}: CardProps) {
  const cardClasses = [
    styles.card,
    variant !== 'default' && styles[variant],
    loading && styles.loading,
    selected && styles.selected,
    disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={cardClasses}
      onClick={!disabled ? onClick : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      {(title || subtitle) && (
        <div className={styles.header}>
          {title && <h3 className={styles.title}>{title}</h3>}
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        </div>
      )}

      {children && <div className={styles.content}>{children}</div>}

      {footer && <div className={styles.footer}>{footer}</div>}
    </div>
  );
}
