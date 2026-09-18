import Image from "next/image";
import Link from "next/link";

export default function Logo({ className = "h-9", priority = false, wordmarkClassName = "" }) {
  return (
    <Link
      href="/"
      aria-label="AlliedRooms"
      className="group inline-flex items-center gap-2.5"
    >
      <Image
        src="/logo.png"
        alt=""
        width={449}
        height={512}
        className={`${className} w-auto transition-transform group-hover:scale-105`}
        priority={priority}
      />
      <span className={`text-lg font-bold tracking-tight text-stone-900 ${wordmarkClassName}`}>
        AlliedRooms
      </span>
    </Link>
  );
}
