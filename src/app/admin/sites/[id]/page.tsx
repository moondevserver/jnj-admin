import { Metadata } from "next";
import { SiteForm } from "@/components/sites/site-form";

export const metadata: Metadata = {
  title: "사이트 수정 | JNJ 관리자 시스템",
  description: "사이트 정보를 수정합니다.",
};

interface EditSitePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditSitePage({ params }: EditSitePageProps) {
  const { id } = await params;
  
  return (
    <div className="container mx-auto py-10">
      <SiteForm siteId={id} />
    </div>
  );
} 