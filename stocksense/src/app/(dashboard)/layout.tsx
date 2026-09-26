import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const userName = session?.user?.name || "Administrator";

  return (
    <div className="flex flex-col min-h-screen bg-odoo-bg">
      {/* 1. Top Navbar */}
      <TopNavbar userName={userName} />

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar */}
        <Sidebar />

        {/* 4. Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
