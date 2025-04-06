import React from "react";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">관리자 페이지</h1>
      <div className="grid gap-4">
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">회원 관리</h2>
          <p className="text-gray-600">회원 목록 및 관리 기능</p>
        </div>
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">권한 관리</h2>
          <p className="text-gray-600">사용자 권한 설정 및 관리</p>
        </div>
        <div className="p-4 border rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">시스템 설정</h2>
          <p className="text-gray-600">시스템 환경 설정</p>
        </div>
      </div>
    </div>
  );
} 