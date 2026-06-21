"use client";
import { useState } from "react";
import { Board, Column, JobApplication } from "../models/models.types";
import { updateJobApplication } from "../actions/job-applications";

export function useBoard(initialBoard?: Board | null) {
	const [board, setBoard] = useState<Board | null>(initialBoard || null);
	const [columns, setColumns] = useState<Column[] | null>(
		initialBoard ? initialBoard.columns || [] : null,
	);
	const [error, setError] = useState<string | null>(null);

	const moveJob = async (
		jobApplicationId: string,
		newColumnId: string,
		newOrder: number,
	) => {
		let updatedJobApplication: JobApplication | null = null;

		setColumns((prev) => {
			const newColumns: Column[] = prev
				? prev.map((col) => ({
					...col,
					jobApplications: [...col.jobApplications],
				}))
				: [];

			// Find and remove job from the old column
			let jobToMove: JobApplication | null = null;
			let oldColumnId: string | null = null;

			for (const col of newColumns) {
				const jobIndex = col.jobApplications.findIndex(
					(j) => j._id === jobApplicationId,
				);
				if (jobIndex !== -1 && jobIndex !== undefined) {
					jobToMove = col.jobApplications[jobIndex];
					oldColumnId = col._id;
					col.jobApplications = col.jobApplications.filter(
						(job) => job._id !== jobApplicationId,
					);
					break;
				}
			}
			if (jobToMove && oldColumnId) {
				const targetColumnIndex = newColumns.findIndex(
					(col) => col._id === newColumnId,
				);

				if (targetColumnIndex !== -1) {
					const targetColumn = newColumns[targetColumnIndex];
					const currentJobs = targetColumn.jobApplications || [];

					const updatedJobs = [...currentJobs];
					const movedJob = {
						...jobToMove,
						columnId: newColumnId,
						order: newOrder * 100,
					};
					updatedJobs.splice(newOrder, 0, movedJob);

					const jobWithUpdatedOrders = updatedJobs.map((job, idx) => ({
						...job,
						order: idx * 100,
					}));

					updatedJobApplication = {
						...movedJob,
						order: newOrder * 100,
					};

					newColumns[targetColumnIndex] = {
						...targetColumn,
						jobApplications: jobWithUpdatedOrders,
					};
				}
			}
			return newColumns;
		});

		if (!updatedJobApplication) {
			return;
		}

		try {
			await updateJobApplication(jobApplicationId, updatedJobApplication);
		} catch (err) {
			console.error("Error: ", err);
		}
	};

	return { board, columns, error, moveJob };
}
