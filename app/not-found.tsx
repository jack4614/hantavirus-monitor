import Link from 'next/link';

export default function NotFound() {
  return (
    <article className="page">
      <h1>Page not found</h1>
      <div className="prose">
        <p>
          This page does not exist or has moved. Start with <Link href="/">what hantavirus is</Link>.
        </p>
      </div>
    </article>
  );
}
