"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { writeListingBack } from "@/lib/listingBack";

function MarkHomeOrigin() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/") {
      writeListingBack({ kind: "home", href: "/rooms" });
    }
  }, [pathname]);

  return null;
}

function MarkSearchOrigin() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname !== "/rooms") return;
    const query = searchParams.toString();
    writeListingBack({
      kind: "search",
      href: query ? `/rooms?${query}` : "/rooms",
    });
  }, [pathname, searchParams]);

  return null;
}

export default function MarkListingOrigin({ from }) {
  if (from === "search") return <MarkSearchOrigin />;
  return <MarkHomeOrigin />;
}
