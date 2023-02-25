<script lang="ts">
  import { page } from "$app/stores";
  import { PUBLIC_URL } from "$env/static/public";
  import { Button, Link as LinkButton } from "$lib/components/button";
  import { Container } from "$lib/components/layout/container";
  import { IconArrowBack, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconEdit, IconLock, IconLockOpen, IconSearch } from "$lib/icons";
  import { formatNumbers, minimize } from "$lib/utils/link";
  import dayjs from "dayjs";
  import { Table, TableBody, TableCell, TableCellLoading, TableFooter, TableHeader, TableHeadRow, TableHeadRowCell, TableRow } from "$lib/components/layout/table";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  export let data: PageData;

  let showSearchResults: boolean = false;
  let loading: boolean = true;

  let pinfo = {
    current: 0,
    total: 0,
    pages: new Array(),
    linksPerPage: 10
  };

  const links = data.links;
  const pagesCount = Math.ceil(links.length / pinfo.linksPerPage);

  for (let i = 0; i < pagesCount; i++) {
    pinfo.pages.push(links.slice(i * pinfo.linksPerPage, (i + 1) * pinfo.linksPerPage));
    pinfo.total += links.slice(i * pinfo.linksPerPage, (i + 1) * pinfo.linksPerPage).length;
  }

  // TODO: Move nextPage, prevPage, firstPage, lastPage to an Separate component
  function nextPage() {
    if (pinfo.current + 1 < pinfo.pages.length) pinfo.current++;
  }

  // TODO: Move nextPage, prevPage, firstPage, lastPage to an Separate component
  function prevPage() {
    if (pinfo.current - 1 >= 0) pinfo.current--;
  }

  // TODO: Move nextPage, prevPage, firstPage, lastPage to an Separate component
  function firstPage() {
    pinfo.current = 0;
  }

  // TODO: Move nextPage, prevPage, firstPage, lastPage to an Separate component
  function lastPage() {
    pinfo.current = pinfo.pages.length - 1;
  }

  let searchResults: any[] = [];
  let search: string = "";

  function update(e: Event) {
    search = (e.target as HTMLInputElement).value ?? "";

    if (search !== "") showSearchResults = true;
    else showSearchResults = false;
    searchResults = [];

    for (let i = 0; i < pinfo.pages.length; i++) {
      for (let j = 0; j < pinfo.pages[i].length; j++) {
        if (pinfo.pages[i][j].url.startsWith(search)) {
          searchResults.push(pinfo.pages[i][j]);
        }
      }
    }
  }

  onMount(() => {
    loading = false;
  });
</script>

<Container maxSize={$page.data.session?.user ? "4xl" : "3xl"}>
  <div class="mb-2 p-0">
    <h1 class="mb-1 text-xl font-bold text-white md:text-2xl">History</h1>
    {#if !$page.data.session?.user}
      <p class="flex items-center gap-2 text-sm font-normal text-red-300">
        If you are not logged in, you will not be able to save all your links generated on different
        devices or access statistics of their usage.
      </p>
    {/if}
    
    <div class="relative mt-2">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400"><IconSearch /></div>
      <input type="search" id="default-search" class="block w-full p-4 pl-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="https://google.com" required on:input={update} />

      {#if showSearchResults}
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
          <span class="text-sm font-normal text-gray-400">{searchResults.length} results</span>
        </div>
      {/if}
    </div>
  </div>

  <Table>
    <TableHeader>
      <TableHeadRow>
        <TableHeadRowCell>URL</TableHeadRowCell>
        <TableHeadRowCell>Shortened URL</TableHeadRowCell>
        <TableHeadRowCell>Date</TableHeadRowCell>
        <TableHeadRowCell>Views</TableHeadRowCell>
        
        {#if $page.data.session?.user}
          {#if $page.data.user?.isPremium}
            <TableHeadRowCell><span class="sr-only">Protected</span></TableHeadRowCell>
          {/if}
          
          <TableHeadRowCell><span class="sr-only">Actions</span></TableHeadRowCell>
        {/if}
      </TableHeadRow>
    </TableHeader>

    <TableBody>
      {#if loading}
        <TableCellLoading count={$page.data.session?.user ? 4 : 3} />
        <TableCellLoading count={$page.data.session?.user ? 4 : 3} />
        <TableCellLoading count={$page.data.session?.user ? 4 : 3} />
      {:else}
      {#if !showSearchResults}
      {#if pinfo.pages[pinfo.current]}
        {#each pinfo.pages[pinfo.current] as link}
          <TableRow>
            <TableCell first={true}>{minimize(link.url)}</TableCell>
            <TableCell>
              <a href={PUBLIC_URL + link.slug} class="text-blue-400 hover:text-blue-500" data-sveltekit-preload-data="off">
                {PUBLIC_URL + link.slug}
              </a>
            </TableCell>
            <TableCell>{dayjs(link.createdAt).format("DD/MM/YYYY HH:mm")}</TableCell>
            <TableCell>{formatNumbers(link.clicks)}</TableCell>
            {#if $page.data.session?.user}
              {#if $page.data.user?.isPremium}
                <TableCell>
                  {#if link.password !== "none"}
                    <span class="group-hover:text-red-500 transition-all">
                      <IconLock />
                    </span>
                  {:else}
                    <span class="group-hover:text-green-500 transition-all">
                      <IconLockOpen />
                    </span>
                  {/if}
                </TableCell>
              {/if}

              <TableCell>
                <a href="{PUBLIC_URL + link.slug}/edit" class="group-hover:text-white transition-all">
                  <IconEdit />
                </a>
              </TableCell>
            {/if}
          </TableRow>
        {/each}
      {/if}
    {:else}
      {#if pinfo.pages[pinfo.current]}
        {#each searchResults as link}
          <TableRow>
            <TableCell first={true}>{minimize(link.url)}</TableCell>
            <TableCell>
              <a href={PUBLIC_URL + link.slug} class=" text-blue-400 hover:text-blue-500" data-sveltekit-preload-data="off">
                {PUBLIC_URL + link.slug}
              </a>
            </TableCell>
            <TableCell>{dayjs(link.createdAt).format("DD/MM/YYYY HH:mm")}</TableCell>
            <TableCell>{formatNumbers(link.clicks)}</TableCell>
            {#if $page.data.session?.user}
              {#if $page.data.user?.isPremium}
                <TableCell>
                  {#if link.password !== "none"}
                    <span class="group-hover:text-red-500 transition-all">
                      <IconLock />
                    </span>
                  {:else}
                    <span class="group-hover:text-green-500 transition-all">
                      <IconLockOpen />
                    </span>
                  {/if}
                </TableCell>
              {/if}

              <TableCell>
                <a href="{PUBLIC_URL + link.slug}/edit" class="group-hover:text-white transition-all bg-red-700">
                  <IconEdit />
                </a>
              </TableCell>
            {/if}
          </TableRow>
        {/each}
      {/if}
    {/if}
      {/if}
    </TableBody>
    
    {#if !showSearchResults && pinfo.total === 0}
      <TableFooter>
        <p class="text-gray-400">History was empty, try to shorten some links!</p>
      </TableFooter>
    {/if}
  </Table>

  {#if pinfo.total > pinfo.linksPerPage}
    <div class="flex items-center justify-center gap-2 pb-5 pt-3">
      <Button props={{ size: "ultrasmall", variant: "gray" }} on:click={() => firstPage()}>
        <IconChevronsLeft />
      </Button>
      <Button props={{ size: "ultrasmall", variant: "gray" }} on:click={() => prevPage()}>
        <IconChevronLeft />
      </Button>
      
      <span class="text-gray-400">Page {pinfo.current + 1} of {pinfo.pages.length}</span>
      <Button props={{ size: "ultrasmall", variant: "gray" }} on:click={() => nextPage()}>
        <IconChevronRight />
      </Button>
      
      <Button props={{ size: "ultrasmall", variant: "gray" }} on:click={() => lastPage()}>
        <IconChevronsRight />
      </Button>
    </div>
  {/if}

  <div class="flex items-center justify-between gap-3 text-sm font-normal">
    <LinkButton props={{ href: "/", withIcon: true, variant: "blue", size: "large" }}>
      <IconArrowBack /> Back to home
    </LinkButton>
  </div>
</Container>