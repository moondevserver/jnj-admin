import { Metadata } from "next";
import { UserTable } from "@/components/users/user-table";

export const metadata: Metadata = {
  title: "사용자 관리 | JNJ 관리자 시스템",
  description: "사용자 목록 관리 페이지",
};

export default function UsersPage() {
  return (
    <div className="container mx-auto py-10">
      <UserTable />
    </div>
  );
} 