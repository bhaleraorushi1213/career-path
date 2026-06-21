"use client";

import { Column, JobApplication } from "@/lib/models/models.types";
import { Card, CardContent } from "./ui/card";
import { Edit2, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { updateJobApplication, deleteJobApplication } from "@/lib/actions/job-applications";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useState } from "react";

interface JobApplicationCardProps {
  job: JobApplication,
  columns: Column[],
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

const JobApplicationCard = ({ job, columns, dragHandleProps }: JobApplicationCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
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
  })

  const handleUpdate = async (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const result = await updateJobApplication(job._id, {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0),
      });

      if(!result.error) {
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to ove job application: ", err);
    }
  }

  const handleDelete = async () => {
    try {
      const result = await deleteJobApplication(job._id);

      if(result.error) {
        console.error("Failed to delete job application: ", result.error);
      }
    } catch (err) {
      console.error("Failed to ove job application: ", err);
    }
  }

  const handleMove = async (newColumnId: string) => {
    try {
      const result = await updateJobApplication(job._id, {
        company: job.company,
        position: job.position,
        columnId: newColumnId,
      });
    } catch (err) {
      console.error("Failed to ove job application: ", err);
    }
  }

  return (
    <>
      <Card 
      className="cursor-pointer transition-shadow hover:shadow-lg bg-white group shadow-sm"
      {...dragHandleProps}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm mb-1">{job.position}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {job.company}
              </p>
              {job.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {job.description}
                </p>
              )}
              {job.tags && job.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {job.tags.map((tag, key) => (
                    <span
                      key={key}
                      className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {job.jobUrl && (
                <a
                  target="_blank"
                  href={job.jobUrl}
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink />
                </a>
              )}
            </div>
            <div className="flex items-start gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <MoreVertical className="size-3 h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40 p-0">
                  <DropdownMenuItem
                    onClick={() => setIsEditing(true)}
                    className="rounded-none border-b border-gray-200 px-3 py-2"
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  {columns.length > 1 && (
                    <>
                      {columns
                        .filter((c) => c._id !== job.columnId)
                        .map((column, key) => (
                          <DropdownMenuItem
                            key={key}
                            className="rounded-none border-b border-gray-200 px-3 py-2"
                            onClick={() => handleMove(column._id)}
                          >
                            Move to {column.name}
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}
                  <DropdownMenuItem 
                  className="text-destructive rounded-none px-3 py-2"
                  onClick={() => handleDelete()}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className={"max-w-2xl"}>
          <DialogHeader>
            <DialogTitle>Add Job Application</DialogTitle>
            <DialogDescription>Track a new job application</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    placeholder="eg.,Google, Microsoft"
                    className="py-5 px-3 rounded-lg"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    placeholder="eg.,Software Engineer"
                    className="py-5 px-3 rounded-lg"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location">Location </Label>
                  <Input
                    id="location"
                    placeholder="eg.,Mumbai, India"
                    className="py-5 px-3 rounded-lg"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salary">Salary </Label>
                  <Input
                    id="salary"
                    placeholder="eg.,₹30,000 - ₹40,000"
                    className="py-5 px-3 rounded-lg"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="jobUrl">Job URL</Label>
                <Input
                  id="jobUrl"
                  placeholder="eg.,https://www.google.com"
                  className="py-5 px-3 rounded-lg"
                  value={formData.jobUrl}
                  onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  placeholder="eg.,React.js,Next.js"
                  className="py-5 px-3 rounded-lg"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={3}
                  placeholder="Add description of role..."
                  className="py-5 px-3 rounded-lg resize-y overflow-y-auto"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes..."
                  rows={4}
                  className="py-5 px-3 rounded-lg resize-y overflow-y-auto"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default JobApplicationCard;