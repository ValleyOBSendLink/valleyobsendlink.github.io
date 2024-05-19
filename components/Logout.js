"use client";

import Loading from "@/components/Loading";
import { useLogOut } from "@/gasFetch";
import { useRouter } from "next/navigation";

export default function Logout({ type, children }) {
  const { data, isLoading } = useLogOut(type);
  const route = useRouter();

  if (isLoading) return <Loading>{children}</Loading>;

  route.push(`/${type}/login`);
  return null;
}
