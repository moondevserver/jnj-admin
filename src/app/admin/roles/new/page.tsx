import { Metadata } from "next";
import { RoleForm } from "@/components/roles/role-form";

export const metadata: Metadata = {
  title: "신규 역할 생성 | JNJ 관리자 시스템",
  description: "새로운 역할을 생성합니다.",
};

export default function CreateRolePage() {
  return (
    <div className="container mx-auto py-10">
      <RoleForm />
    </div>
  );
} 