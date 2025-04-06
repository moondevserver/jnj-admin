import { Metadata } from "next";
import { EditUserPageClient } from "./page.client";

export const metadata: Metadata = {
  title: "사용자 수정 | JNJ 관리자 시스템",
  description: "사용자 정보를 수정합니다.",
};

interface EditUserPageProps {
  params: {
    id: string;
  };
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  console.log('EditUserPage rendered with params:', params);
  
  return (
    <EditUserPageClient 
      params={{
        id: params.id
      }} 
    />
  );
} 