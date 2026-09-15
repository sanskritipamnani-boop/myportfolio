import styles from './QuoteBlock.module.css';

type QuoteBlockProps = {
  text: string;
  attribution?: string;
};

export default function QuoteBlock({ text, attribution }: QuoteBlockProps) {
  return (
    <figure className={styles.figure}>
      <blockquote className={styles.quote}>
        <p className={styles.text}>{text}</p>
      </blockquote>
      {attribution && (
        <figcaption className={styles.attribution}>{attribution}</figcaption>
      )}
    </figure>
  );
}
