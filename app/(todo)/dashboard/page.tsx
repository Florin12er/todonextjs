import { auth } from "@clerk/nextjs/server";
import { ProjectDashboard } from "./_components/ProjectDashboard";

export default function DashboardPage() {
  const { userId } = auth();

  return (
    <div className="p-6">
      <ProjectDashboard />
    </div>
  );
}
