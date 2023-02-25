<script lang="ts">
  import { Container } from "$lib/components/layout/container";
  import { Input, Toggle } from "$lib/components/forms";
  import { Button, Link as LinkButton } from "$lib/components/button";
  import { IconArrowBack, IconCheck, IconRocket, IconTrash } from "$lib/icons";
  import type { PageData } from './$types';
  import { PUBLIC_URL } from "$env/static/public";
  import { pushToast } from "$lib/components/layout/toast";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { restRequest } from "$lib/utils/request/request";
  import type { Link } from "$lib/types/link.type";
  import { deleteLink } from "$lib/utils/link";

  export let data: PageData;

  let link: Link = {
    url: data.link.url,
    slug: data.link.slug,
    visitorId: data.link.visitorId,
    status: data.link.status,
    clicks: data.link.clicks,
    password: data.link.password,
  };

  let changes = { url: false, status: false, password: false, subdomain: false };
  $: somethingChanged = changes.url == false && changes.status == false && changes.password == false && changes.subdomain == false;

  $: changes.url = link.url !== data.link.url;
  $: changes.status = link.status !== data.link.status;

  let deleted = false;

  async function save() {
    const response = await restRequest<Link>("put", PUBLIC_URL + "api/link/update", {
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slug: data.link.slug,
        data: {
          url: link.url,
          status: link.status
         }
      })
    });

    if (!response.success) {
      pushToast("Something went wrong", "danger");
      return;
    }

    pushToast("Link updated successfully", "success");
    link = response.data;
  }

  async function removeLink() {
    deleted = true;
    const response = await deleteLink(data.link.slug);

    if (response) {
      pushToast("Link deleted successfully", "success");
      goto("/history");
    } else {
      pushToast("Something went wrong", "danger");
    }
  }
</script>

<Container maxSize="md">
  <div class="mb-3 p-0">
    <h1 class="text-2xl font-bold text-white">Edit link</h1>
    <p class="text-sm font-normal text-gray-500">Here, you can edit some of the settings for your link.</p>
    {#if !$page.data.user?.isPremium}
      <p class="flex gap-1 text-sm font-normal text-pro-200">
        <IconRocket />
        Upgrade to Pro to get access a more advanced link editor.
      </p>
    {/if}
  </div>

  <form class="flex flex-col gap-1">
    <Input bind:value={link.url} props={{ placeholder: "https://example.com", size: "small", width: "full" }} />

    {#if $page.data.user?.isPremium}
      <div class="relative mt-1">
        <Input value={data.link.slug} props={{ placeholder: "https://example.com", size: "small", width: "full", tip: "https://linkfy.fr/", disabled: !$page.data.user?.isPremium }} />
      </div>
    {/if}

    <div class="mt-3 flex flex-col gap-3">
      <Toggle props={{ label: link.status ? "Click here to disable it" : "Click here to activate it", disabled: false, checked: link.status }} bind:checked={link.status} />

      {#if $page.data.user?.isPremium}
        <div class="flex relative items-center">
          <Toggle props={{ label: "Password protection", checked: changes.password }} bind:checked={changes.password} />
        </div>

        {#if changes.password }
          <Input props={{
            placeholder: "Password needed to access this link",
            size: "small",
            width: "full",
            disabled: !$page.data.user?.isPremium,
            type: "password"
          }} value="" />
        {/if}
      {/if}
    </div>

    <div class="flex items-center justify-between gap-2 text-sm font-normal mt-3">
      {#if !deleted}
        <Button props={{ type: "button", size: "large", variant: "blue", withIcon: true, disabled: somethingChanged }} on:click={save}>
          {#if !somethingChanged}
            <IconCheck /> Save changes
          {:else}
            Nothing changed
          {/if}
        </Button>

        <LinkButton props={{ href: "/history", size: "medium", variant: "blue", withIcon: true }}>
          <IconArrowBack />
        </LinkButton>

        <Button props={{ type: "button", size: "medium", variant: "red", disabled: deleted }} on:click={removeLink}>
          <IconTrash />
        </Button>
      {:else}
        <div class="mb-1 h-4 w-full animate-pulse rounded bg-gray-600 p-5" />
        <div class="mb-1 h-4 w-10 animate-pulse rounded bg-gray-600 p-5" />
        <div class="mb-1 h-4 w-10 animate-pulse rounded bg-gray-600 p-5" />
      {/if}
    </div>
  </form>
</Container>