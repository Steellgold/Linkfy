<script>
  import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center mt-10 gap-2">
  <h1 class="text-8xl font-bold text-white">{$page.status}</h1>
  <p class="text-1xl text-white">{$page.error?.message}.</p>
</div>