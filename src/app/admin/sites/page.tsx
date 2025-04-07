import { Metadata } from "next";
import { SiteTable } from "@/components/sites/site-table";

export const metadata: Metadata = {
  title: "사이트 관리 | JNJ 관리자 시스템",
  description: "사이트 목록 관리 페이지",
};

export default function SitesPage() {
  return (
    <div className="container mx-auto py-10">
      <SiteTable />
    </div>
  );
} 