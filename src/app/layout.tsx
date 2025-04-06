import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ApolloWrapper } from "@/components/apollo-wrapper";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JNJ 관리자 시스템",
  description: "회원/인증/권한 관리 시스템",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <ApolloWrapper>
          {children}
          <Toaster />
        </ApolloWrapper>
      </body>
    </html>
  );
}
