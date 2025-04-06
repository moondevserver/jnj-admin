import { Metadata } from "next";
import { RoleTable } from "@/components/roles/role-table";

export const metadata: Metadata = {
  title: "역할 관리 | JNJ 관리자 시스템",
  description: "역할 목록 관리 페이지",
};

export default function RolesPage() {
  return (
    <div className="container mx-auto py-10">
      <RoleTable />
    </div>
  );
} 