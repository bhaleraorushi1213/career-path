import { getSession } from '@/lib/auth/auth';
import { Board } from '@/lib/models';
import { LayoutGrid, Loader2Icon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import connectDB from '@/lib/db';
import KanbanBoard from '@/components/dashboard/kanban-board';

const getBoard = async (userId: string) => {
  "use cache";
  // cacheTag(`board-${userId}`);

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

  if (!boardDoc) return null;

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
    <>
      <div className="pt-24" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a3d52 #10151c" }}>
        <div className="px-4 sm:px-6 lg:px-8 py-6 border-b-[#1e2a38]">
          <div className="max-w-full flex flex-col sm:flex-row sm:items-end gap-6">
            <div>
              <h1 className="text-2xl font-bold text-white font-['Space Grotesk', sans-serif]">
                My Job Pipeline
              </h1>
              <p className="text-[#7a90a4] text-sm mt-1">Tracking 5 roles across your search</p>
            </div>

            <div className=" w-auto">
              <div className="bg-[#1e2a38]/50 border border-[#2a3d52] rounded-xl p-4 flex items-center justify-between">
                <div className="text-sm flex items-start gap-2">
                  <p className="text-white font-medium">Pro-tip: <span className="text-[#7a90a4]">Drag and drop cards to move them between columns. Click the <span className="text-[#d9a441] font-bold">&apos;+&apos;</span> icon or click <span className="text-gray-300/90">&apos;Add Job&apos;</span> to add a new job application.</span></p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <div className="flex justify-between px-4 sm:px-6 lg:px-8 py-6 border-b-[#1e2a38]">

        <div className="flex items-center gap-3 text-base text-[#4a5a6a]">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span className="font-medium text-[#7a90a4]">Kanban Board</span>
        </div>

        {/* QUICK STATS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-[#1e2a38] border-[#2a3d52]">
            <span className="text-[#7a90a4] text-xs">Active</span>
            <span className="font-bold text-white">5</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm bg-[#1e2a38] border-[#2a3d52]">
            <span className="text-[#7a90a4] text-xs">Interviews</span>
            <span className="font-bold text-[#d9a441]">10</span>
          </div>
          {/* {offers > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm" style={{ background: 'rgba(58,150,104,0.12)', border: '1px solid rgba(58,150,104,0.3)' }}>
                  <span className="text-xs" style={{ color: '#3a9668' }}>Offers</span>
                  <span className="font-bold" style={{ color: '#3a9668' }}>{offers}</span>
                </div>
              )} */}
        </div>
      </div>

      {/* KANBAN BOARD */}
      <div className="flex-1 relative">
        <div className="lg:h-full">
          <KanbanBoard key={board._id} board={board} userId={session.user.id} />
        </div>
      </div>
    </>
  )
}

const Dashboard = async () => {
  return (
    <Suspense fallback={<Loader2Icon className="mx-auto h-screen flex justify-center items-center size-16 animate-spin " />}>
      <DashboardPage />
    </Suspense>
  )
}

export default Dashboard;