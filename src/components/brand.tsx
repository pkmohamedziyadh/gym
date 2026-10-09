import Link from "next/link";

export function Brand() {
  return (
    <Link href="/" className="brand" aria-label="Forma home">
      <span className="brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      forma<span className="brand-dot">.</span>
    </Link>
  );
}
