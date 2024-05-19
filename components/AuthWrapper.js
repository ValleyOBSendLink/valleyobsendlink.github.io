"use client";

import Loading from "@/components/Loading";
import { useAuthCheck } from "@/gasFetch";
import { usePathname, useRouter } from "next/navigation";
import { SWRConfig } from "swr";

export default function AuthWrapper({ type, children }) {
  const { data: isAuthorized, isLoading } = useAuthCheck(type);

  const route = useRouter();

  let pathname = usePathname();

  if (pathname.includes("login") || pathname.includes("forget-password"))
    return <SWRConfig>{children}</SWRConfig>;

  // console.log(isAuthorized);

  if (isLoading) return <Loading>{children}</Loading>;

  if (!isAuthorized) {
    route.push(`/${type}/login`);
    return null;
  }

  return <SWRConfig>{children}</SWRConfig>;
}
