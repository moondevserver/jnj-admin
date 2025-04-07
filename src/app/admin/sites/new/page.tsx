import { Metadata } from "next";
import { SiteForm } from "@/components/sites/site-form";

export const metadata: Metadata = {
  title: "신규 사이트 생성 | JNJ 관리자 시스템",
  description: "새로운 사이트를 생성합니다.",
};

export default function CreateSitePage() {
  return (
    <div className="container mx-auto py-10">
      <SiteForm />
    </div>
  );
} 