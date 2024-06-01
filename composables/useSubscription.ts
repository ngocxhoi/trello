export const useUseSubscription = () => {
  const isLoading = ref(false);

  const subscriptionModelState = useState(
    "subscription-model-state",
    () => false
  );

  const modelTitle = useState(() => "Upgrade to premium");
  const modelDescription = useState(
    () => "Create unlimited boards and access all premium features"
  );

  function showSubscriptionModel(options?: {
    title: string;
    description: string;
  }) {
    if (options?.title) {
      modelTitle.value = options.title;
    }

    if (options?.description) {
      modelDescription.value = options.description;
    }

    subscriptionModelState.value = true;
  }

  function hideSubscriptionModel() {
    subscriptionModelState.value = false;
  }

  async function subscribe() {
    try {
      isLoading.value = true;
      const { data, error } = await useFetch(`/api/users/subscribe`, {
        method: "POST",
        watch: false,
      });

      if (data.value) {
        window.location.href = data.value;
      }

      if (error.value) throw error.value.data;
    } catch (error: any) {
      console.log(error);
      useToast().add({
        title: "Opp!",
        description: error.message || "Some thing wen't wrong!",
        timeout: 5000,
        icon: "i-heroicons-x-mark",
        color: "red",
      });
    } finally {
      isLoading.value = false;
    }
  }

  async function access_portal() {
    try {
      isLoading.value = true;
      const { data, error } = await useFetch(`/api/users/access-portal`, {
        watch: false,
      });

      if (data.value) {
        window.location.href = data.value;
      }

      if (error.value) throw error.value.data;
    } catch (error: any) {
      console.log(error);
      useToast().add({
        title: "Opp!",
        description: error.message || "Some thing wen't wrong!",
        timeout: 5000,
        icon: "i-heroicons-x-mark",
        color: "red",
      });
    } finally {
      isLoading.value = false;
    }
  }

  watch(
    () => subscriptionModelState,
    (val) => {
      if (!val) {
        setTimeout(() => {
          modelTitle.value = "Upgrade to premium";
          modelDescription.value =
            "Create unlimited boards and access all premium features";
        }, 200);
      }
    }
  );
  return {
    showSubscriptionModel,
    hideSubscriptionModel,
    subscribe,
    access_portal,
    isLoading,
    subscriptionModelState,
    modelTitle,
    modelDescription,
  };
};
