<script lang="ts">
  import { PUBLIC_API_URL } from "$env/static/public";
  import { Button } from "$lib/components/button";
  import { Input } from "$lib/components/forms";
  import { Container } from "$lib/components/layout/container";
  import { pushToast } from "$lib/components/layout/toast";
  import { IconAlertTriangle, IconLockOpen } from "$lib/icons";
  import type { ActionData, PageServerData } from "./$types";

  export let data: PageServerData;

  export let form: ActionData;

  $: if (form?.error) {
    setTimeout(() => {
      pushToast(form?.error ?? "An error occured", "danger");
    }, 100);
  }
</script>

<Container maxSize="md">
  <div class="mb-3 p-0">
    <h1 class="mb-1 text-xl font-bold text-white md:text-2xl">This link is protected</h1>
    <p class="text-sm font-normal mt-3 text-white">
      The link you are trying to access is protected by a password. <br>
      Please enter the password to access the link, if you do not have the password, please contact the owner of the link. <br>
    </p>
    <p class="text-sm font-normal mt-2 text-red-200 flex gap-1">
      <IconAlertTriangle /> The password cannot be recovered without the owner's help.
    </p>
  </div>

  <form method="POST">
    <div class="mb-3">
      <Input value="" props={{ type: "password", placeholder: "•••••••••••", size: "small", width: "full", name: "password" }} />
    </div>

    <div class="flex items-center justify-between gap-2 text-sm font-normal">
      <Button props={{ type: "submit", size: "large", variant: "blue", withIcon: true }}>
        <IconLockOpen /> Unlock and access the link
      </Button>
    </div>
  </form>
</Container>