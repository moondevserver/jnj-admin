import { Metadata } from "next";
import { PermissionTable } from "@/components/permissions/permission-table";

export const metadata: Metadata = {
  title: "권한 관리 | JNJ 관리자 시스템",
  description: "권한 목록 관리 페이지",
};

export default function PermissionsPage() {
  return (
    <div className="container mx-auto py-10">
      <PermissionTable />
    </div>
  );
} 