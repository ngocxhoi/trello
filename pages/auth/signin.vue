<template>
  <WrapperAuth>
    <h1 class="text-xl font-bold mt-4">Login to your account</h1>

    <UCard>
      <UForm
        :schema="SignInSchema"
        :state="state"
        class="space-y-4"
        @submit="handleSignIn"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton block :loading="isLoading" type="submit" label="Login In" />

        <div>
          <span>You don't have an account?</span>
          <a
            href="/auth/signup"
            class="text-blue-400 hover:text-blue-500 underline ml-1"
            >Sign up</a
          >
        </div>
      </UForm>
    </UCard>
  </WrapperAuth>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { SignInSchema } from "~/schemas/Signin.schema";

const { signIn } = useAuth();

type Schema = z.output<typeof SignInSchema>;

const state = reactive({
  email: "admin@example.com",
  password: "22222222",
});

const isLoading = ref(false);

async function handleSignIn(event: FormSubmitEvent<Schema>) {
  // Do something with data
  try {
    isLoading.value = true;
    let res = await signIn("credentials", {
      email: event.data.email,
      password: event.data.password,
      redirect: false,
    });
    if (!res?.error) {
      navigateTo("/");
    }
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
