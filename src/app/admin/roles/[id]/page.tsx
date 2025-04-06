import { Metadata } from "next";
import { RoleForm } from "@/components/roles/role-form";

export const metadata: Metadata = {
  title: "역할 수정 | JNJ 관리자 시스템",
  description: "역할 정보를 수정합니다.",
};

interface EditRolePageProps {
  params: {
    id: string;
  };
}

export default function EditRolePage({ params }: EditRolePageProps) {
  return (
    <div className="container mx-auto py-10">
      <RoleForm roleId={params.id} />
    </div>
  );
} 