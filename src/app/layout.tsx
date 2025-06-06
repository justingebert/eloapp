import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { GroupsProvider } from "@/components/GroupProvider";
import { Toaster } from "@/components/ui/sonner";
import SWRErrorHandlingProvider from "@/components/swrErrorProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Elo App",
  description: "elo app for games",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <link rel="icon" href="/icons/web/favicon.ico" sizes="any" />
        <div className="p-4 h-[100dvh]">
          <SWRErrorHandlingProvider>
            <GroupsProvider>
            {children}
            <Toaster position="top-center" richColors={true}/>
            </GroupsProvider>
          </SWRErrorHandlingProvider>
        </div>
      </body>
    </html>
  );
}

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};