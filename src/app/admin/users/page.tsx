import { Metadata } from "next";
import UserList from '@/components/users/user-list';

export const metadata: Metadata = {
  title: "사용자 관리 | JNJ 관리자 시스템",
  description: "사용자 목록 관리 페이지",
};

export default function UsersPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">사용자 관리</h1>
      </div>
      <UserList />
    </div>
  );
} 