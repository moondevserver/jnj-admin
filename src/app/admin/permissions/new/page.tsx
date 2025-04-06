import { Metadata } from "next";
import { PermissionForm } from "@/components/permissions/permission-form";

export const metadata: Metadata = {
  title: "신규 권한 생성 | JNJ 관리자 시스템",
  description: "새로운 권한을 생성합니다.",
};

export default function CreatePermissionPage() {
  return (
    <div className="container mx-auto py-10">
      <PermissionForm />
    </div>
  );
} 