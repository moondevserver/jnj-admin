import { Metadata } from "next";
import { PermissionForm } from "@/components/permissions/permission-form";

export const metadata: Metadata = {
  title: "권한 수정 | JNJ 관리자 시스템",
  description: "권한 정보 수정 페이지",
};

interface PermissionEditPageProps {
  params: {
    id: string;
  };
}

export default function PermissionEditPage({ params }: PermissionEditPageProps) {
  return (
    <div className="container mx-auto py-10">
      <PermissionForm permissionId={params.id} />
    </div>
  );
} 