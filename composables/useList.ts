import type { List } from "@prisma/client";

export const useUseList = () => {
  async function handleSort(e: any, lists: List[]) {
    if (e.oldIndex == e.newIndex) return;
    let newList = lists.map((list: List, index: number) => {
      list.order = index + 1;
      return list;
    });

    const indexFrom = e.oldIndex < e.newIndex ? e.oldIndex : e.newIndex;
    const indexTo = e.oldIndex > e.newIndex ? e.oldIndex : e.newIndex;

    for (let i = indexFrom; i <= indexTo; i++) {
      await useFetch(`/api/lists/${newList[i].id}`, {
        method: "PUT",
        body: {
          order: newList[i].order,
        },
        watch: false,
      });
    }
  }

  async function onDelete(listId: string) {
    if (!confirm("Are you sure you want to delete this card")) return;
    try {
      let { error } = await useFetch(`/api/lists/${listId}`, {
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
      console.log(error);
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
    handleSort,
    onDelete,
  };
};
