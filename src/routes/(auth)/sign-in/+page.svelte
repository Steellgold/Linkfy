<script lang="ts">
  import type { ActionData } from "./$types";
  import { Button } from "$lib/components/button";
  import { Input } from "$lib/components/forms/input";
  import { Container } from "$lib/components/layout/container";
  import { pushToast } from "$lib/components/layout/toast";

  export let email: string;
  export let password: string;

  export let form: ActionData;

  $: if (form?.error) {
    setTimeout(() => {
      pushToast(form?.error ?? "An error occured", "danger");
    }, 100);
  }
</script>

<Container maxSize="md">
  <form method="POST">
    <div class="mb-3">
      <Input bind:value={email} props={{ type: "email", label: "Email address", placeholder: "johndoe@example.com", width: "full", size: "small", name: "email", required: true }} />
    </div>

    <div class="mb-0">
      <Input bind:value={password} props={{ type: "password", label: "Password", placeholder: "••••••••", width: "full", size: "small", name: "password", required: true }} />
    </div>

    <div class="mt-5">
      <Button props={{ type: "submit", size: "large", variant: "blue" }}>Se connecter</Button>
    </div>

    <div class="mt-4">
      <p class="font-sm text-sm text-gray-400">
        Don't have an account? <a href="/sign-up" class="2s transition-all ease-in-out hover:text-gray-300">Sign up</a>
      </p>
    </div>
  </form>
</Container>
