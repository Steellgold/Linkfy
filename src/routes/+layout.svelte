<script lang="ts">
  import { supabaseClient } from "$lib/database/supabase";
  import { invalidateAll } from "$app/navigation";
  import { onMount } from "svelte";
  import { Header } from "$lib/components/layout/header";
  import { Toasts } from "$lib/components/layout/toast";
  import "../app.postcss";

  onMount(() => {
    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange(() => {
      invalidateAll();
    });

    return () => {
      subscription.unsubscribe();
    };
  });
</script>

<Header>
  <slot />
</Header>

<Toasts />
