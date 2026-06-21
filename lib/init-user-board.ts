import connectDB from "./db";
import { Board, Column } from "./models";

const DEFAULT_COLUMNS = [
	{
		name: "Wish List",
		order: 0,
	},
	{
		name: "Applied",
		order: 1,
	},
	{
		name: "Interviewing",
		order: 2,
	},
	{
		name: "Offer",
		order: 3,
	},
	{
		name: "Rejected",
		order: 4,
	},
];

export const initializeUserBoard = async (userId: string) => {
	try {
		await connectDB();
		
		// Checks if board already exists
		const existingBoard = await Board.findOne({ userId, name: "Job Hunt" });

		if (existingBoard) {
			return existingBoard;
		}

		// Creat the board
		const board = await Board.create({
			name: "Job Hunt",
			userId,
			column: [],
		});

		// Create the columns
		const columns = await Promise.all(
			DEFAULT_COLUMNS.map((col) => Column.create({
        name: col.name,
        order: col.order,
        boardId: board._id,
        jobApplication: [],
      })),
		);

    // Add the columns to the board
    board.columns = columns.map((col) => col._id);
    await board.save();

    return board;
	} catch (error) {
		throw error;
	}
};
