<script lang="ts">
  import { page } from "$app/stores";
</script>

<h1 class="text-center text-white text-4xl font-bold">
  {#if $page.data.session}
    Welcome back, {$page.data.session.user.email}
  {:else}
    Welcome to the app
    <br>
    <a href="/sign-in" class="text-blue-500">Login</a> or <a href="/sign-up" class="text-blue-500">Sign up</a>
  {/if}
</h1>