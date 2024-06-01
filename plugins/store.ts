export default defineNuxtPlugin((nuxtApp) => {
  return {
    provide: {
      $auth: nuxtApp.$auth,
      $globalStore: useMyGlobalStore(),
      $boardsStore: useMyBoardsStore(),
    },
  };
});
