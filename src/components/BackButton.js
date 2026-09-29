"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { listingBackFromReferrer, readListingBack } from "@/lib/listingBack";

const DEFAULT_BACK = {
  label: "View all listings",
  href: "/rooms",
};

function configFromOrigin(origin) {
  if (origin?.kind === "search") {
    return {
      label: "Back to search",
      href: origin.href || "/rooms",
    };
  }
  return DEFAULT_BACK;
}

export default function BackButton() {
  const [back, setBack] = useState(DEFAULT_BACK);

  useEffect(() => {
    setBack(configFromOrigin(readListingBack() || listingBackFromReferrer()));
  }, []);

  return (
    <Link
      href={back.href}
      className="mb-6 inline-block text-sm font-bold text-teal-950 hover:underline"
    >
      ← {back.label}
    </Link>
  );
}
