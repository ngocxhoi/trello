import type { List } from "@prisma/client";

export const useUseBoard = () => {
  async function onDelete(boardId: string) {
    if (!confirm("Are you sure you want to delete this card")) return;
    try {
      let { error } = await useFetch(`/api/boards/${boardId}`, {
        method: "DELETE",
      });

      if (error.value) throw error.value;

      useToast().add({
        title: "Board deleted",
        icon: "i-heroicons-check",
        color: "primary",
      });
      return true;
    } catch (error: any) {
      useToast().add({
        title: "Opp!",
        description: error.message || "Some thing wen't wrong!",
        icon: "i-heroicons-x-mark",
        color: "red",
      });
      return false;
    }
  }

  return {
    onDelete,
  };
};
