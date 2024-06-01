import type { Board, Card, List } from "@prisma/client";
import { defineStore } from "pinia";

export const useMyGlobalStore = defineStore({
  id: "myGlobalStore",
  state: () => ({
    selectedBoard: null as unknown,
    selectedList: null as unknown,
    selectedCard: null as unknown,
  }),
  actions: {
    // Board
    getSelectedBoard() {
      return this.selectedBoard;
    },
    setSelectedBoard(board: Board) {
      this.selectedBoard = board;
    },
    resetSelectedBoard() {
      this.selectedBoard = null as unknown;
    },

    // List
    getSelectedList() {
      return this.selectedList;
    },

    setSelectedList(list: List) {
      this.selectedList = list;
    },

    resetSelectedList() {
      this.selectedList = null as unknown;
    },

    // Card
    getSelectedCard() {
      return this.selectedCard;
    },

    setSelectedCard(card: Card) {
      this.selectedCard = card;
    },

    resetSelectedCard() {
      this.selectedCard = null as unknown;
    },
  },
  persist: true,
});
