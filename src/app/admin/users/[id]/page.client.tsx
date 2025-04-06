"use client";

import { UserForm } from "@/components/users/user-form";

interface EditUserPageClientProps {
  params: {
    id: string;
  };
}

export function EditUserPageClient({ params }: EditUserPageClientProps) {
  console.log('EditUserPageClient rendered with params:', params);
  
  // params가 Promise인 경우 JSON 문자열로 변환된 값을 파싱
  const userId = typeof params === 'string' 
    ? JSON.parse(params).id 
    : params.id;

  console.log('Parsed userId:', userId);
  
  return (
    <div className="container mx-auto py-6">
      <UserForm userId={userId} />
    </div>
  );
} 