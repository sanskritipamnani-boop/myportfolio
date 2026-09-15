import styles from './Tag.module.css';

type TagProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Tag({ children, className = '' }: TagProps) {
  return (
    <span className={`${styles.tag} ${className}`}>
      {children}
    </span>
  );
}
