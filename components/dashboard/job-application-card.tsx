"use client";

import { useEffect, useState, useRef } from "react";

import { Column, JobApplication } from "@/lib/models/models.types";
import { updateJobApplication, deleteJobApplication } from "@/lib/actions/job-applications";
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Edit2, GripVertical, IndianRupee, MapPin, MoreVertical, Trash2, X } from "lucide-react";
import { SlideOverPortal } from "./slide-over-portal";
import JobDetailSheet from "./job-detail-sheet";
import { useRouter } from "next/navigation";

interface JobApplicationCardProps {
  job: JobApplication,
  columns: Column[],
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  onExpand?: (job: JobApplication) => void;
}

const STEPS = ["Details", "Compensation", "Notes"];

interface EditApplicationProps {
  job: JobApplication;
  columns: Column[];
  onClose: () => void;
}

const EditApplication = ({ job, onClose }: EditApplicationProps) => {
  const [step, setStep] = useState(0);
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [error, setError] = useState<{ company?: string; position?: string; }>({});
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company: job.company,
    position: job.position,
    location: job.location || "",
    notes: job.notes || "",
    salary: job.salary || "",
    jobUrl: job.jobUrl || "",
    columnId: job.columnId || "",
    tags: job.tags?.join(", ") || "",
    description: job.description || "",
  });

  const router = useRouter();

  const handleClose = () => {
    onClose();
    setStep(0);
    setFormData({
      company: job.company,
      position: job.position,
      location: job.location || "",
      notes: job.notes || "",
      salary: job.salary || "",
      jobUrl: job.jobUrl || "",
      columnId: job.columnId || "",
      tags: job.tags?.join(", ") || "",
      description: job.description || "",
    });
  };

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true)

    if (step !== STEPS.length - 1) return;

    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (result && !result.error) {
        onClose();
        router?.refresh();
      } else {
        console.error("Failed to move job application: ", result.error);
      }
    } catch (err) {
      console.error("Failed to move job application: ", err);
    } finally {
      setLoading(false)
    }
  };

  const handleRemoteChange = () => {
    setIsRemote((prev) => !prev);
    setFormData({ ...formData, location: isRemote ? job.location || "" : "Remote" });
  }

  const handleNext = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validate()) {
      return;
    }
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    }
  };

  const validate = () => {
    const errors: { company?: string; position?: string; } = {};
    if (step === 0 && !formData.company) {
      errors.company = "Company name is required";
    }

    if (step === 0 && !formData.position) {
      errors.position = "Position is required";
    }

    setError(errors);
    return Object.keys(errors).length === 0;
  }

  const inputClass =
    "w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#4a6c8f] transition-all bg-[#10151c] border border-[#2a3d52] text-[#e8edf2] font-['DM Sans', sans-serif]";

  const field = (key: keyof typeof formData) => ({
    value: formData[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [key]: e.target.value })
      setError({ ...error, [key]: "" });
    }
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black z-40"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", damping: 28, stiffness: 260 }}
        className="fixed top-0 right-0 h-full z-50 flex flex-col bg-[#1e2a38] border border-l-[#2a3d52] shadow-[-32px_0_60px_rgba(0,0,0,0.6)]"
        style={{
          width: "min(460px, 100vw)",
        }}
      >
        {/* HEADER */}
        <div className="px-6 py-5 border-b border-[#2a3d52] bg-[#10151c]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2
                className="text-lg font-bold text-whitefont-['Space Grotesk', sans-serif]"
              >
                Edit Job Application
              </h2>
              <p className="text-[#7a90a4] text-xs mt-0.5">
                Step {step + 1} of {STEPS.length} — {STEPS[step]}
              </p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#2a3d52] text-[#7a90a4] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div
                key={s}
                className="flex-1 h-1 rounded-full transition-all"
                style={{ background: i <= step ? "#d9a441" : "#2a3d52" }}
              />
            ))}
          </div>
        </div>

        {/* FORM */}
        <form onSubmit={handleUpdate} className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-6" style={{ scrollbarWidth: "none" }}>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step0"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col gap-4"
                >
                  {/* COMPANY NAME */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Company *
                    </label>
                    <input
                      {...field("company")}
                      placeholder="e.g. Google, Microsoft"
                      className={inputClass}
                      style={{ border: error?.company ? "1px solid red" : "#2a3d52" }}
                    />
                    {error?.company && <p className="text-red-400 text-xs mt-1">{error?.company}</p>}
                  </div>

                  {/* POSITION */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Position *
                    </label>
                    <input
                      {...field("position")}
                      placeholder="e.g. Software Engineer"
                      className={inputClass}
                      style={{ border: error?.position ? "1px solid red" : "#2a3d52" }}
                    />
                    {error?.position && <p className="text-red-400 text-xs mt-1">{error?.position}</p>}
                  </div>

                  {/* LOCATION */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Location
                    </label>
                    <input
                      {...field("location")}
                      placeholder="e.g. Mumbai, India"
                      className={inputClass}
                      disabled={isRemote}
                    />
                    <div className="flex gap-2 items-center pt-2 justify-end">
                      <input
                        id="remote"
                        type="checkbox"
                        name="remote location"
                        checked={isRemote}
                        onChange={handleRemoteChange}
                        className="size-3"
                      />
                      <label htmlFor="remote" className="text-xs text-[#7a90a4] font-medium uppercase tracking-wider">
                        Remote
                      </label>
                    </div>
                  </div>

                  {/* JOB URL */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Job URL
                    </label>
                    <input
                      {...field("jobUrl")}
                      placeholder="e.g. https://www.google.com/careers"
                      className={inputClass}
                    />
                  </div>

                  {/* TAGS */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Tags (comma separated)
                    </label>
                    <input
                      {...field("tags")}
                      placeholder="e.g. React, Next.js, Remote"
                      className={inputClass}
                    />
                  </div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col gap-4"
                >
                  {/* SALARY */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Salary
                    </label>
                    <input
                      {...field("salary")}
                      placeholder="e.g. ₹30,000 – ₹40,000"
                      className={inputClass}
                    />
                  </div>

                  {/* JOB DESCRIPTION */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Job Description
                    </label>
                    <textarea
                      {...field("description")}
                      placeholder="Paste the job description here..."
                      className={inputClass}
                      style={{ minHeight: "180px", resize: "vertical" }}
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="flex flex-col gap-4"
                >
                  {/* NOTES */}
                  <div>
                    <label className="text-xs text-[#7a90a4] font-medium mb-1.5 block uppercase tracking-wider">
                      Notes
                    </label>
                    <textarea
                      {...field("notes")}
                      placeholder="Recruiter contact info, interview tips, follow-up dates..."
                      className={inputClass}
                      style={{ minHeight: "200px", resize: "vertical" }}
                    />
                  </div>
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: "rgba(217,164,65,0.08)",
                      border: "1px solid rgba(217,164,65,0.2)",
                    }}
                  >
                    <p className="text-xs text-[#d9a441] font-medium mb-1">You&apos;re almost done!</p>
                    <p className="text-xs text-[#7a90a4]">
                      Review your notes then submit to add this application.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* NAVIGATION */}
          <div
            className="px-6 py-4 border-t border-[#2a3d52] flex gap-3 bg-[#10151c]"
          >
            {step > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setStep((s) => s - 1);
                }}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-[#7a90a4] hover:text-white transition-colors bg-[#2a3d52]"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </button>
            )}
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={handleNext}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 text-white bg-[#4a6c8f]"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                className="flex-1 justify-center py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90 bg-[#d9a441] text-[#10151c]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#10151c]/30 border-t-[#10151c] rounded-full animate-spin" />
                    Edting Application...
                  </span>) :
                  "Edit Application"
                }
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </>
  );
}

const JobApplicationCard = ({ job, columns, dragHandleProps }: JobApplicationCardProps) => {
  const [showDetail, setShowDetail] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHasMounted(true);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      window.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  const handleDelete = async () => {
    try {
      const result = await deleteJobApplication(job._id);

      if (!result.error) {
        router?.refresh();
      } else {
        console.error("Failed to delete job application: ", result.error);
      }
    } catch (err) {
      console.error("Failed to delete job application: ", err);
    }
  }

  // const handleMove = async (newColumnId: string) => {
  //   try {
  //     const result = await updateJobApplication(job._id, {
  //       company: job.company,
  //       position: job.position,
  //       columnId: newColumnId,
  //     });

  //     if (result.error) {
  //       console.error("Failed to move job application: ", result.error);
  //     }

  //   } catch (err) {
  //     console.error("Failed to move job application: ", err);
  //   }
  // }

  return (
    <>
      <motion.div
        layout
        className="rounded-xl p-4 cursor-default select-none group w-75 lg:w-full h-50 lg:h-62.5"
        style={{
          background: "linear-gradient(135deg, #1e2a38 0%, #1a2330 100%)",
          border: "1px solid #2a3d52",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        }}
        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }}

      >
        {/* HEADER */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 min-w-0">
            {hasMounted && dragHandleProps && (
              <div
                {...dragHandleProps}
                className="text-gray-400 hover:text-[#4a6c8f] cursor-grab active:cursor-grabbing shrink-0 touch-none"
              >
                <GripVertical className="w-4 h-4" />
              </div>
            )}
            <div className="min-w-0">
              <h3
                className="text-sm font-semibold text-white leading-tight truncate"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {job.position}
              </h3>
              <p className="text-xs text-[#7a90a4] mt-0.5">{job.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">

            {/* EXPAND BUTTON */}
            <button
              onClick={() => setShowDetail(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-[#4a6c8f]/20 text-gray-400 hover:text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* MENU */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu((v) => !v)}
                className="w-7 h-7 rounded-lg flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity hover:bg-[#2a3d52] text-gray-400 hover:text-white"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`absolute right-0 top-8 rounded-xl py-1 bg-[#1e2a38] border border-[#2a3d52] shadow-[0_8px_24px_rgba(0,0,0,0.4)] min-w-30 ${showMenu ? "overflow-visible" : "overflow-hidden"}`}
                  >
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        setShowEdit(true);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#a0b4c8] hover:bg-[#2a3d52] hover:text-white transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Edit
                    </button>
                    {/* {columns.length > 1 && (
                      <>
                        {columns
                          .filter((c) => c._id !== job.columnId)
                          .map((column, key) => (
                            <button
                              key={key}
                              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-[#a0b4c8] hover:bg-[#2a3d52] hover:text-white transition-colors text-start"
                              onClick={() => {
                                setShowMenu(false);
                                handleMove(column._id);
                              }}
                            >
                              Move to {column.name}
                            </button>
                          ))}
                      </>
                    )} */}
                    <button
                      onClick={() => {
                        setShowMenu(false);
                        handleDelete();
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-[#2a3d52] transition-colors text-destructive"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* SALARY */}
        {job.salary && (
          <div className="flex items-center gap-1 text-xs mb-2" style={{ color: "#d9a441" }}>
            <IndianRupee className="w-3 h-3" />
            <span className="font-medium">{job.salary}</span>
          </div>
        )}

        {/* LOCATION */}
        {job.location && (
          <div className="flex items-center gap-1 text-xs text-[#7a90a4] mb-3">
            <MapPin className="w-3 h-3" />
            <span>{job.location}</span>
          </div>
        )}

        {/* TAGS */}
        {job.tags && job.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(74,108,143,0.25)", color: "#7aacce", border: "1px solid rgba(74,108,143,0.4)" }}
              >
                {tag}
              </span>
            ))}
            {job.tags.length > 3 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-medium"
                style={{ background: "rgba(74,108,143,0.25)", color: "#7aacce", border: "1px solid rgba(74,108,143,0.4)" }}
              >
                +{job.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* JOB DESCRIPTION */}
        {job.description && (
          <p className="text-xs text-gray-300 leading-relaxed line-clamp-3 mb-2">
            {job.description}
          </p>
        )}
      </motion.div>

      {/* JOB DETAIL SHEET SIDEOVER */}
      <SlideOverPortal>

        <AnimatePresence>
          {showDetail && (
            <JobDetailSheet
              job={job}
              columns={columns}
              onClose={() => setShowDetail(false)}
              onEdit={() => { setShowDetail(false); setShowEdit(true); }}
            />
          )}
        </AnimatePresence>
      </SlideOverPortal>

      {/* EDIT APPLICATION SIDEOVER */}
      <SlideOverPortal>
        <AnimatePresence>
          {showEdit && (
            <EditApplication job={job} columns={columns} onClose={() => setShowEdit(false)} />
          )}
        </AnimatePresence>
      </SlideOverPortal>
    </>
  )
}

export default JobApplicationCard;