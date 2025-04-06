import { Metadata } from "next";
import UserForm from '@/components/users/user-form';

export const metadata: Metadata = {
  title: "사용자 수정 | JNJ 관리자 시스템",
  description: "사용자 정보를 수정합니다.",
};

interface Props {
  params: {
    id: string;
  };
}

export default function UserEditPage({ params }: Props) {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">사용자 수정</h1>
      <UserForm id={params.id} />
    </div>
  );
} 