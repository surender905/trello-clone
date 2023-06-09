import { gettodosGroupedByColumn } from "@/lib/getTodos";
import { Board, Column, TypedColumn } from "@/typing";
import { create } from "zustand";
interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardStore:(board:Board)=>void
}

export const useBoardStore = create<BoardState>((set) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },
    getBoard: async () => {
        const board = await gettodosGroupedByColumn()
        
        set({board})
      
  },
  setBoardStore: (board) => set({board})
}));
