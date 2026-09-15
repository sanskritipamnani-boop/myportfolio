import styles from './Container.module.css';

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'footer' | 'main' | 'article';
};

export default function Container({ children, className = '', as: Tag = 'div' }: ContainerProps) {
  return (
    <Tag className={`${styles.container} ${className}`}>
      {children}
    </Tag>
  );
}
