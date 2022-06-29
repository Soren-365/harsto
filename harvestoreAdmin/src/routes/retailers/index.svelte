<script>
  import TitlePage from "$lib/components/titlePage.svelte";
  import Button from "$lib/components/button.svelte";
  import { retailerStore } from "$lib/stores/retailerStore";
  import retailersService from "$lib/retailers.service";
  import { onDestroy } from "svelte";
  import { invalidate, beforeNavigate, afterNavigate } from "$app/navigation";

  export let retailers;
  let retailerToAdd = [];

  const unsubscribe = retailerStore.subscribe((retailer) => {
    if (retailer !== undefined) {
      retailerToAdd = [retailer];
    }
  });
  onDestroy(unsubscribe);

  // added Code
  beforeNavigate(({ from, to }) => {
    retailerStore.set(); // removing the optimistic update
  });

  $: searchTerm = "";
  $: filteredRetailers = retailers.concat(retailerToAdd).filter((retailer) => {
    return (
      retailer._source.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
      -1
    );
  });

  function handleDeleteRetailer(id) {
    filteredRetailers = filteredRetailers.filter((retailer) => {
      return retailer._id !== id;
    });

    if (id !== "optimistic-update") {
      retailersService.deleteRetailer({ _id: id });
    } else {
      retailerStore.set(); // removing the optimistic update
      invalidate();
    }
  }
</script>

<svelte:head>
  <title>Harvestore - 🛍️ Retailers</title>
</svelte:head>

<div class="container p-5">
  <header class="mb-10">
    <div class="inline-flex">
      <TitlePage title="🛍️ Retailers" />
    </div>
    <div>
      <a href={"retailers/create"}>
        <Button title="Create Retailer" />
      </a>
    </div>
  </header>

  <main>
    <div class="mb-5">
      <input
        bind:value={searchTerm}
        type="search"
        class="shadow rounded-lg border-1 border-purple-500 focus:ring-purple-500 focus:border-purple-500"
        placeholder="Search retailer..."
      />
    </div>
    <div class="container max-h-full">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Name
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Hostmane
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {#each filteredRetailers as retailer, i}
            <tr class={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >{retailer._source.name}</td
              >
              <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{retailer._source.hostname}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex flex-row-revers mr-5">
                  <a href={`/retailers/update/${retailer._id}`}>
                    <button class="ml-5">✏️</button>
                  </a>
                  <button
                    class="ml-5"
                    on:click={handleDeleteRetailer(retailer._id)}>🗑️</button
                  >
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </main>
</div>
