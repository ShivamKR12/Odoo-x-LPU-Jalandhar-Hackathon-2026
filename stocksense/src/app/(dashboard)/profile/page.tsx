import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { UserCircle, Mail, Briefcase, ShieldCheck } from "lucide-react";
import prisma from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    return <div>Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <div>User not found in DB</div>;
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-32 bg-slate-800 relative">
          <div className="absolute -bottom-12 left-8 w-24 h-24 bg-white rounded-full p-1 shadow-md">
            <div className="w-full h-full bg-orange-100 rounded-full flex items-center justify-center text-orange-500">
              <UserCircle size={48} />
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 mb-6 font-medium flex items-center gap-2">
            <ShieldCheck size={16} className="text-green-500" />
            {user.role}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Email Address</p>
                <p className="font-semibold text-slate-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 border border-slate-100 rounded-lg bg-slate-50">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <div>
                <p className="text-sm text-slate-500 font-medium">Role Level</p>
                <p className="font-semibold text-slate-800 capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
