"use client"

import { Board, Column, JobApplication } from "@/lib/models/models.types";
import { Inbox, Mic, Send, Star, XCircle } from "lucide-react";
import CreateJobApplicationDialog from "./create-job-dialog";
import JobApplicationCard from "./job-application-card";
import { useBoard } from "@/lib/hooks/useBoard";
import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useDroppable,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { useState } from "react";

interface KanbanBoardProps {
  board: Board;
  userId: string;
}

interface ColConfig {
  color: string;
  accentColor: string;
  icon: React.ReactNode;
  emptyHeadline: string;
  emptySub: string;
}

const COLUMN_CONFIG: ColConfig[] = [
  {
    color: "#4a6c8f",
    accentColor: "#6a8caf",
    icon: <Inbox className="w-4 h-4" />,
    emptyHeadline: "Dream big.",
    emptySub: "Add roles you're excited about.",
  },
  {
    color: "#5a7fa0",
    accentColor: "#7a9fc0",
    icon: <Send className="w-4 h-4" />,
    emptyHeadline: "Ready to launch?",
    emptySub: "Track submitted applications here.",
  },
  {
    color: "#d9a441",
    accentColor: "#e9b461",
    icon: <Mic className="w-4 h-4" />,
    emptyHeadline: "No interviews yet.",
    emptySub: "Keep applying — they'll come.",
  },
  {
    color: "#3a9668",
    accentColor: "#4ab678",
    icon: <Star className="w-4 h-4" />,
    emptyHeadline: "Offers incoming.",
    emptySub: "Your hard work pays off here.",
  },
  {
    color: "#8f4a4a",
    accentColor: "#af6a6a",
    icon: <XCircle className="w-4 h-4" />,
    emptyHeadline: "Clear slate.",
    emptySub: "Every no brings you closer to yes.",
  },
];

const DroppableColumn = ({
  column,
  config,
  boardId,
  sortedColumns
}: {
  column: Column,
  config: ColConfig,
  boardId: string,
  sortedColumns: Column[]
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column._id,
    data: {
      type: "column",
      columnId: column._id,
    }
  })

  const sortedJobs = column.jobApplications.sort((a, b) => a.order - b.order) || [];

  return (
    <div
      className="flex flex-col shrink-0 rounded-2xl overflow-hidden w-full lg:w-70.5 h-87.5 lg:h-full"
      style={{
        background: isOver ? "rgba(74,108,143,0.08)" : "rgba(16,21,28,0.6)",
        border: isOver ? `1px solid ${config.color}` : "1px solid #1e2a38",
        transition: "border-color 0.2s, background 0.2s",
      }}
    >
      {/* COLUMN HEADER */}
      <div
        className="px-4 py-3 flex items-center justify-between border-b border-[#1e2a38] bg-[rgba(30,42,56,0.8)]"
      >
        <div className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center`}
            style={{ background: `${config.color}22`, color: `${config.color}` }}
          >
            {config.icon}
          </div>
          <span
            className="text-sm font-semibold text-white"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            {column.name}
          </span>
        </div>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ background: `${config.color}33`, color: config.color }}
        >
          {sortedJobs.length}
        </div>
      </div>

      {/* CARDS AREA */}
      <div
        ref={setNodeRef}
        className="flex-1 p-3 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto lg:min-h-100"
        style={{ scrollbarWidth: "none" }}
      >
        <SortableContext
          items={sortedJobs.map((job) => job._id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedJobs.map((job) => (
            <SortableJobCard
              key={job._id}
              job={{ ...job, columnId: job.columnId || column._id }}
              columns={sortedColumns}
            />
          ))}
        </SortableContext>

        {sortedJobs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col items-center justify-center text-center py-12 px-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: `${config.color}15`, color: `${config.color}80` }}
            >
              {config.icon}
            </div>
            <p
              className="text-sm font-semibold text-white mb-1"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              {config.emptyHeadline}
            </p>
            <p className="text-xs text-[#7a90a4]">{config.emptySub}</p>
          </motion.div>
        )}
      </div>
      <div className="p-3">
        <CreateJobApplicationDialog columnId={column._id} boardId={boardId} />
      </div>
    </div>
  )
}

const SortableJobCard = ({ job, columns }: { job: JobApplication; columns: Column[] }) => {
  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef
  } = useSortable({
    id: job._id,
    data: {
      type: "job",
      job,
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    rotate: isDragging ? "2deg" : "0deg",
  }

  return (
    <div ref={setNodeRef} style={style}>
      <JobApplicationCard
        job={job}
        columns={columns}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  )
}

const KanbanBoard = ({ board, userId }: KanbanBoardProps) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { columns, moveJob } = useBoard(board);

  const sortedColumns = columns?.sort((a, b) => a.order - b.order) || [];

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      }
    })
  );

  const handleDragStart = async (event: DragStartEvent) => {
    setActiveId(event.active.id as string)
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over || !board._id) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    let draggedJob: JobApplication | null = null;
    let sourceColumn: Column | null = null;
    let sourceIndex = -1;

    for (const column of sortedColumns) {
      const jobs = column.jobApplications.sort((a, b) => a.order - b.order) || [];
      const jobIndex = jobs.findIndex((j) => j._id === activeId);

      if (jobIndex !== -1) {
        draggedJob = jobs[jobIndex];
        sourceColumn = column;
        sourceIndex = jobIndex;
        break;
      }
    }

    if (!draggedJob || !sourceColumn) return;

    // Check if dropped in a column or another job
    const targetColumn = sortedColumns.find((col) => col._id === overId);
    const targetJob = sortedColumns
      .flatMap((col) => col.jobApplications || [])
      .find((job) => job._id === overId)

    let targetColumnId: string;
    let newOrder: number;

    if (targetColumn) {
      targetColumnId = targetColumn._id;
      const jobsInTarget =
        targetColumn.jobApplications
          .filter((j) => j._id !== activeId)
          .sort((a, b) => a.order - b.order) || [];

      newOrder = jobsInTarget.length;
    } else if (targetJob) {
      const targetJobColumn = sortedColumns.find((col) =>
        col.jobApplications.some((j) => j._id === targetJob._id)
      );

      targetColumnId = targetJob.columnId || targetJobColumn?._id || "";

      if (!targetColumnId) return;

      const targetColumnObj = sortedColumns.find(
        (col) => col._id === targetColumnId
      );

      if (!targetColumnObj) return;

      const allJobsInTargetOriginal =
        targetColumnObj.jobApplications.sort((a, b) => a.order - b.order) || [];

      const allJobsInTargetFiltered =
        allJobsInTargetOriginal.filter((j) => j._id !== activeId) || [];

      const targetIndexInOriginal = allJobsInTargetOriginal.findIndex(
        (j) => j._id === overId
      );

      const targetIndexInFiltered = allJobsInTargetFiltered.findIndex(
        (j) => j._id === overId
      );

      if (targetIndexInFiltered !== -1) {
        if (sourceColumn._id === targetColumnId) {
          if (sourceIndex < targetIndexInOriginal) {
            newOrder = targetIndexInFiltered + 1;
          } else {
            newOrder = targetIndexInFiltered;
          }
        } else {
          newOrder = targetIndexInFiltered
        }
      } else {
        newOrder = allJobsInTargetFiltered.length;
      }
    } else {
      return;
    }

    if (!targetColumnId) {
      return;
    }

    await moveJob(activeId, targetColumnId, newOrder);
  }

  const activeJob = sortedColumns
    .flatMap((col) => col.jobApplications || [])
    .find((job) => job._id === activeId)

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        className="flex flex-col lg:flex-row gap-y-6 lg:gap-x-4 overflow-x-auto pb-6 px-6 scroll-container"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#2a3d52 #10151c",
          scrollBehavior: "smooth",
        }}
      >
        {sortedColumns.map((col, key) => {
          const config = COLUMN_CONFIG[key] || COLUMN_CONFIG[0];
          return (
            <DroppableColumn
              key={key}
              column={col}
              config={config}
              boardId={board._id}
              sortedColumns={sortedColumns}
            />
          );
        })}
      </div>

      <DragOverlay>
        {activeJob ? (
          <div style={{ opacity: 0.5, rotate: "2deg", scale: "1.03" }}>
            <JobApplicationCard
              job={activeJob}
              columns={sortedColumns}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard;