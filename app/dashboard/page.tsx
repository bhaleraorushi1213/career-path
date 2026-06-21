import KanbanBoard from '@/components/kanban-board';
import { getSession } from '@/lib/auth/auth';
import connectDB from '@/lib/db';
import { Board } from '@/lib/models';
import { Loader2Icon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

const getBoard = async (userId: string) => {
  "use cache";
  await connectDB();

  const boardDoc = await Board.findOne({
    userId: userId,
    name: "Job Hunt"
  }).populate({
    path: "columns",
    populate: {
      path: "jobApplications"
    }
  })

  if(!boardDoc) return null;

  const board = JSON.parse(JSON.stringify(boardDoc));

  return board;
}

const DashboardPage = async () => {
  const session = await getSession();

  if (!session?.user) {
    redirect('/login')
  }

  const board = await getBoard(session.user.id);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black">Job Hunt</h1>
          <p className="text-gray-600">Track your job applications</p>
        </div>
        <KanbanBoard board={board} userId={session.user.id} />
      </div>
    </div>
  )
}

const Dashboard = async () => {
  return (
  <Suspense fallback={<Loader2Icon className="mx-auto h-screen flex justify-center items-center size-16 animate-spin "/>}>
    <DashboardPage />
  </Suspense>
  )
}

export default Dashboard;