import { Metadata } from "next";
import { UserForm } from "@/components/users/user-form";

export const metadata: Metadata = {
  title: "신규 사용자 생성 | JNJ 관리자 시스템",
  description: "새로운 사용자를 생성합니다.",
};

export default function CreateUserPage() {
  return (
    <div className="container mx-auto py-10">
      <UserForm />
    </div>
  );
} 