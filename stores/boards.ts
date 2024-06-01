import type { Board } from "@prisma/client";
import { defineStore } from "pinia";

export const useMyBoardsStore = defineStore({
  id: "myBoardsStore",
  state: () => ({
    selectedBoard: null as unknown,
  }),
  actions: {
    getSelectedBoard() {
      return this.selectedBoard;
    },

    setSelectedBoard(board: Board) {
      this.selectedBoard = board;
    },

    resetSelectedBoard() {
      this.selectedBoard = null as unknown;
    },
  },
  persist: true,
});
