"use client";

import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useState } from "react";
import { createJobApplication } from "@/lib/actions/job-applications";
import { AnimatePresence, motion } from "framer-motion";
import { SlideOverPortal } from "./slide-over-portal";
import { useRouter } from "next/navigation";

interface CreateJobApplicationdialogProps {
  columnId: string,
  boardId: string
}

const STEPS = ["Details", "Compensation", "Notes"];

const INITIAL_FORMDATA = {
  company: "",
  position: "",
  location: "",
  notes: "",
  salary: "",
  jobUrl: "",
  tags: "",
  description: "",
}

const CreateJobApplicationDialog = ({
  columnId, boardId
}: CreateJobApplicationdialogProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [step, setStep] = useState(0);
  const [isRemote, setIsRemote] = useState<boolean>(false);
  const [formData, setFormData] = useState(INITIAL_FORMDATA);
  const [error, setError] = useState<{ company?: string; position?: string; }>({});
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onClose = () => {
    setOpen(false);
    setStep(0);
    setFormData(INITIAL_FORMDATA);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);

    if (step !== STEPS.length - 1) return;

    try {
      const result = await createJobApplication({
        ...formData,
        columnId,
        boardId,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if (result && !result.error) {
        onClose();
        router.refresh();
      } else {
        console.error("Failed to create job: ", result?.error)
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoteChange = () => {
    setIsRemote((prev) => !prev);
    setFormData({ ...formData, location: isRemote ? "" : "Remote" });
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
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFormData({ ...formData, [key]: e.target.value });
      setError({ ...error, [key]: "" });
    },
  });

  return (
    <>
      <SlideOverPortal>
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-8 right-8 z-30 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{
            background: 'linear-gradient(135deg, #d9a441, #c8932a)',
            boxShadow: '0 8px 32px rgba(217,164,65,0.4)',
          }}
          aria-label="Add new job"
        >
          <Plus className="w-6 h-6 text-[#10151c] font-bold" strokeWidth={2.5} />
        </motion.button>
      </SlideOverPortal>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full mb-2 flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all text-[#7a90a4] border border-[#2a3d52] font-['DM Sans', sans-serif] border-dashed bg-transparent"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderStyle = "solid";
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(74,108,143,0.08)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.borderStyle = "dashed";
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
        }}
      >
        <Plus className="w-4 h-4" />
        Add job
      </button>

      <SlideOverPortal>

        {/* BACKDROP EFFECT */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={onClose}
            />
          )}
        </AnimatePresence>

        {/* SLIDE OVER*/}
        <AnimatePresence>
          {open && (
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
                      className="text-lg font-bold text-white font-['Space Grotesk', sans-serif]"
                    >
                      Add Job Application
                    </h2>
                    <p className="text-[#7a90a4] text-xs mt-0.5">
                      Step {step + 1} of {STEPS.length} — {STEPS[step]}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onClose()}
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
              <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
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
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 bg-[#4a6c8f] text-white"
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
                          Creating Application...
                        </span>) :
                        "Add Application"
                      }
                    </button>
                  )}
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </SlideOverPortal>
    </>
  )
}

export default CreateJobApplicationDialog;