"use client";

import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  router.push("/admin");

  return <Loading />;
}
