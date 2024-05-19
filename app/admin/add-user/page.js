"use client";

import AddUser from "@/components/admin/AddUser";
import Home from "@/components/admin/Home";
import { SWRConfig } from "swr";

export default function AddUserPage() {
  return (
    <SWRConfig>
      <Home />
      <AddUser />
    </SWRConfig>
  );
}
