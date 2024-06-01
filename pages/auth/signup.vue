<template>
  <WrapperAuth>
    <h1 class="text-xl font-bold mt-4">Sign up to your account</h1>

    <UCard>
      <UForm
        :schema="SignUpSchema"
        :state="state"
        class="space-y-4"
        @submit="handleSignUp"
      >
        <UFormGroup label="Name" name="name">
          <UInput v-model="state.name" />
        </UFormGroup>
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="confirmPassword">
          <UInput v-model="state.passwordConfirm" type="password" />
        </UFormGroup>

        <UButton block :loading="isLoading" type="submit" label="Sign Up" />

        <div>
          <span>Do you have an account?</span>
          <a
            href="/auth/signin"
            class="text-blue-400 hover:text-blue-500 underline ml-1"
            >Login</a
          >
        </div>
      </UForm>
    </UCard>
  </WrapperAuth>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { SignUpSchema } from "~/schemas/Signup.schema";

const { signIn } = useAuth();

type Schema = z.output<typeof SignUpSchema>;

let state = reactive({
  name: "nxh",
  email: "test@example.com",
  password: "22222222",
  passwordConfirm: "22222222",
  stripeCustomerId: "",
  subscription: {
    id: "",
    status: "",
    priceId: "",
  },
});

const isLoading = ref(false);

async function handleSignUp(event: FormSubmitEvent<Schema>) {
  // Do something with data
  try {
    isLoading.value = true;
    let { error } = await useFetch("/api/users", {
      method: "post",
      body: event.data,
      watch: false,
    });

    if (error.value) throw error.value;

    useToast().add({
      title: "Account created!",
      description: "Your account has been created",
      timeout: 5000,
      icon: "i-heroicons-check",
    });

    let res = await signIn("credentials", {
      email: event.data.email,
      password: event.data.password,
      redirect: false,
    });

    if (!res?.error) {
      navigateTo("/");
    }
  } catch (error: any) {
    useToast().add({
      title: "Opp!",
      description: error.message || "Some thing wen't wrong!",
      timeout: 5000,
      icon: "i-heroicons-x-mark",
      color: "red",
    });
    console.log(error);
  } finally {
    isLoading.value = false;
  }
}
</script>
