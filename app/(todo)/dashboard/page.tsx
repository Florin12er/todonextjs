import { auth } from "@clerk/nextjs/server";

export default function DashboardPage() {
  const { userId } = auth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome to Your Dashboard</h1>
      <p>User ID: {userId}</p>
      {/* Add more dashboard content here */}
    </div>
  );
}
