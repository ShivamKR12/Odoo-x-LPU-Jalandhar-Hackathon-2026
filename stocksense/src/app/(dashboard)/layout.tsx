import Sidebar from "@/components/Sidebar";
import TopNavbar from "@/components/TopNavbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-screen bg-odoo-bg">
      {/* 1. Top Navbar */}
      <TopNavbar />

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
