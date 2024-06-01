import type { Card } from "@prisma/client";

export const useUseCard = () => {
  async function updateCard(
    cardId: string,
    listId: string,
    data: Partial<Card>
  ) {
    try {
      let { data: res, error } = await useFetch(
        `api/lists/${listId}/card/${cardId}`,
        {
          method: "PUT",
          body: data,
          watch: false,
        }
      );

      if (error.value) throw error.value;

      return res;
    } catch (error: any) {
      useToast().add({
        title: "Oop!",
        description: error.message || "Some thing wen't wrong!",
        icon: "i-heroicons-x-mark",
        color: "red",
      });
    }
  }

  async function createCard(listId: string, data: Partial<Card>) {
    try {
      let { data: res, error } = await useFetch(`api/lists/${listId}/card`, {
        method: "POST",
        body: data,
        watch: false,
      });

      if (error.value) throw error.value;

      useToast().add({
        title: "Card Created",
        icon: "i-heroicons-check",
      });
      return res;
    } catch (error: any) {
      useToast().add({
        title: "Oop!",
        description: error.message || "Some thing wen't wrong!",
        icon: "i-heroicons-x-mark",
        color: "red",
      });
    }
  }

  async function changeCard(listId: string, data: Array<Card>) {
    try {
      for (let i = 0; i < data.length; i++) {
        let { data: res, error } = await useFetch(
          `api/lists/${data[i].listId}/card/${data[i].id}`,
          {
            method: "PUT",
            body: {
              listId: listId,
              order: i + 1,
            },
            watch: false,
          }
        );

        if (error.value) {
          throw error.value;
          break;
        }
      }
    } catch (error: any) {
      useToast().add({
        title: "Oop!",
        description: error.message || "Some thing wen't wrong!",
        icon: "i-heroicons-x-mark",
        color: "red",
      });
    }
  }

  async function deleteCard(listId: string, cardId: string) {
    try {
      let { data: res, error } = await useFetch(
        `api/lists/${listId}/card/${cardId}`,
        {
          method: "DELETE",
          watch: false,
        }
      );

      if (error.value) throw error.value;

      useToast().add({
        title: "Card deleted",
        icon: "i-heroicons-check",
      });
    } catch (error: any) {
      useToast().add({
        title: "Oop!",
        description: error.message || "Some thing wen't wrong!",
        icon: "i-heroicons-x-mark",
        color: "red",
      });
    }
  }

  return { updateCard, createCard, changeCard, deleteCard };
};
