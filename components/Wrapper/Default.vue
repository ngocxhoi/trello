<template>
  <div>
    <header class="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800">
      <UContainer>
        <div class="flex justify-between">
          <NuxtLink to="/">
            <Logo class="size-8" />
          </NuxtLink>

          <div class="inline-flex justify-end gap-4 items-center">
            <slot name="action" />

            <Icon
              v-if="!userSession.hasActiveSubscription"
              name="heroicons:star"
              size="20"
              class="text-amber-500 cursor-pointer"
              @click="showSubscriptionModel"
            />

            <ColorSwitcher />
            <UDropdown :items="dropdownItems">
              <Icon name="heroicons:user-circle" size="30" />

              <template #profile>
                <div class="text-left">
                  <p v-if="data">Signed in as</p>
                  <p v-else>Not signed</p>
                  <p class="truncate font-medium text-gray-900 dark:text-white">
                    {{ userSession.email }}
                  </p>
                </div>
              </template>

              <template #auth_action>
                <div
                  v-if="userSession"
                  class="flex items-center w-full h-full text-gray-400 dark:text-gray-500 hover:text-gray-500 hover:dark:text-gray-400"
                  @click="signOut()"
                >
                  <UIcon
                    name="i-heroicons-arrow-right-on-rectangle"
                    class="flex-shrink-0 size-5"
                  />
                  <span class="ml-1.5 text-gray-900 dark:text-white"
                    >Sign out</span
                  >
                </div>
                <div
                  v-else
                  class="flex items-center w-full h-full text-gray-400 dark:text-gray-500 hover:text-gray-500 hover:dark:text-gray-800"
                  @click="navigateTo('/auth/signin')"
                >
                  <UIcon
                    name="i-heroicons-arrow-right-end-on-rectangle"
                    class="flex-shrink-0 size-5"
                  />
                  <span class="ml-1.5 text-gray-900 dark:text-white"
                    >Sign in</span
                  >
                </div>
              </template>
            </UDropdown>
          </div>
        </div>
      </UContainer>
    </header>

    <div class="box-border p-6 relative">
      <UContainer>
        <slot />
      </UContainer>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "@prisma/client";

// import type { Session } from "~/node_modules/next-auth/core/types";

const { data, signOut } = useAuth();
const userSession = data.value?.user as User;

const { showSubscriptionModel, access_portal } = useUseSubscription();
const dropdownItems = [
  [
    {
      label: "Profile",
      slot: "profile",
      disabled: true,
      avatar: {
        src: "/user-placeholder.png",
      },
    },
  ],
  [
    {
      label: "Billing",
      icon: "i-heroicons-credit-card",
      click: async () => await access_portal(),
    },
  ],
  [
    {
      label: "Auth",
      slot: "auth_action",
    },
  ],
  [
    {
      label: "Delete Account",
      icon: "i-heroicons-user-minus",
      click: async () => handleDeleteAccount(),
    },
  ],
];

async function handleDeleteAccount() {
  if (confirm("Are you sure you want to delete")) {
    await useFetch("/api/users/1", {
      method: "DELETE",
    });
    await signOut();
    useToast().add({
      title: "Account deleted!",
      description: "Your account has been deleted",
      timeout: 5000,
      icon: "i-heroicons-check",
    });
  } else return;
}
</script>

<style></style>
