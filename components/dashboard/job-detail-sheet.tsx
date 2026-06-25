"use client";

import { useState } from 'react'
import { motion } from "framer-motion";
import { Column, JobApplication } from '@/lib/models/models.types';
import { updateJobApplication } from '@/lib/actions/job-applications';
import { Edit2, Edit3, ExternalLink, IndianRupee, MapPin, X } from 'lucide-react';
import Link from 'next/link';

interface JobDetailSheetProps {
  job: JobApplication;
  columns: Column[];
  onClose: () => void;
  onEdit: () => void;
}

const JobDetailSheet = ({ job, columns, onClose, onEdit }: JobDetailSheetProps) => {
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState("");

  const column = columns?.find((c) => c._id === job.columnId);

  const handleSaveNotes = async () => {
    try {
      await updateJobApplication(job._id, {
        company: job.company,
        position: job.position,
        columnId: job.columnId ?? "",
        location: job.location,
        notes: notesValue,
        salary: job.salary,
        jobUrl: job.jobUrl,
        order: job.order,
        tags: job.tags,
        description: job.description,
      });
      setEditingNotes(false);
    } catch (err) {
      console.error("Failed to save notes:", err);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 28, stiffness: 280 }}
        className="fixed top-0 right-0 h-full z-50 flex flex-col overflow-hidden"
        style={{
          width: "min(480px, 100vw)",
          background: "#1e2a38",
          borderLeft: "1px solid #2a3d52",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.5)",
        }}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-[#2a3d52] flex items-start justify-between gap-4" style={{ background: "#10151c" }}>
          <div className="min-w-0">
            {column && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold mb-1 inline-block"
                style={{ background: "rgba(74,108,143,0.2)", color: "#7aacce" }}
              >
                {column.name}
              </span>
            )}
            <h2 className="text-lg font-bold text-white leading-tight" style={{ fontFamily: "Space Grotesk, sans-serif" }}>
              {job.position}
            </h2>
            <p className="text-[#7a90a4] text-sm mt-1">{job.company}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#2a3d52] transition-colors text-[#7a90a4] hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          {/* META DATA */}
          <div className="px-6 py-4 border-b border-[#2a3d52]">
            <div className="grid grid-cols-2 gap-3">
              {job.salary && (
                <div className="flex gap-2">
                  <IndianRupee className="w-4 h-4 shrink-0 mt-1" style={{ color: "#d9a441" }} />
                  <div>
                    <p className="text-[#7a90a4] text-sm">Salary</p>
                    <p className="font-semibold" style={{ color: "#d9a441" }}>{job.salary}</p>
                  </div>
                </div>
              )}
              {job.location && (
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 shrink-0 text-[#4a6c8f] mt-1" />
                  <div>
                    <p className="text-[#7a90a4] text-sm">Location</p>
                    <p className="text-white font-medium">{job.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TAGS */}
          {job.tags && job.tags.length > 0 && (
            <div className="px-6 py-4 border-b border-[#2a3d52]">
              <p className="text-xs text-[#7a90a4] font-medium mb-2 uppercase tracking-wider">Tags</p>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{ background: "rgba(74,108,143,0.25)", color: "#7aacce", border: "1px solid rgba(74,108,143,0.4)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* DESCRIPTION */}
          {job.description && (
            <div
              className="px-6 py-4 border-b border-[#2a3d52] "

            >
              <p className="text-xs text-[#7a90a4] font-medium mb-3 uppercase tracking-wider">Job Description</p>
              <div className="max-h-1/12 overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "#2a3d52 #10151c" }}>
                <p className="text-sm text-[#a0b4c8] leading-relaxed">{job.description}</p>
              </div>
            </div>
          )}

          {/* NOTES */}
          <div className="px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-[#7a90a4] font-medium uppercase tracking-wider">My Notes</p>
              {!editingNotes && (
                <button
                  onClick={() => {
                    if (job.notes) setNotesValue(job.notes);
                    setEditingNotes(true);
                  }}
                  className="flex items-center gap-1 text-xs text-[#4a6c8f] hover:text-[#7aacce] transition-colors"
                >
                  <Edit3 className="w-3 h-3" />
                  Edit
                </button>
              )}
            </div>
            {editingNotes ? (
              <div>
                <textarea
                  value={notesValue}
                  onChange={(e) => setNotesValue(e.target.value)}
                  className="w-full rounded-xl p-3 text-sm resize-none focus:outline-none focus:ring-2"
                  style={{ background: "#10151c", border: "1px solid #4a6c8f", color: "#e8edf2", minHeight: "120px", fontFamily: "DM Sans, sans-serif" }}
                  placeholder="Add your notes here..."
                  autoFocus
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveNotes}
                    className="px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90"
                    style={{ background: "#d9a441", color: "#10151c" }}
                  >
                    Save Notes
                  </button>
                  <button
                    onClick={() => setEditingNotes(false)}
                    className="px-4 py-2 rounded-lg text-xs font-medium text-[#7a90a4] hover:text-white transition-colors"
                    style={{ background: "#2a3d52" }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#a0b4c8] leading-relaxed">
                {job.notes || <span className="italic text-[#4a5a6a]">No notes yet. Click Edit to add some.</span>}
              </p>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 border-t border-[#2a3d52] flex gap-3" style={{ background: "#10151c" }}>
          <button
            onClick={onEdit}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
            style={{ background: "#2a3d52", color: "#e8edf2" }}
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
          {job.jobUrl && (
            <Link
              href={job.jobUrl}
              target="_blank"
              rel="noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
              style={{ background: "rgba(74,108,143,0.2)", color: "#7aacce", border: "1px solid #4a6c8f" }}
            >
              <ExternalLink className="w-4 h-4" />
              View Job Posting
            </Link>
          )}
        </div>
      </motion.div>
    </>
  )
}

export default JobDetailSheet;