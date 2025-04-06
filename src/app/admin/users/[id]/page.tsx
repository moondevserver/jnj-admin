import { Metadata } from "next";
import { UserForm } from "@/components/users/user-form";

export const metadata: Metadata = {
  title: "사용자 수정 | JNJ 관리자 시스템",
  description: "사용자 정보를 수정합니다.",
};

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  return (
    <div className="container mx-auto py-10">
      <UserForm userId={params.id} />
    </div>
  );
} 