<script>
  import TitlePage from "$lib/components/titlePage.svelte";
  import Button from "$lib/components/button.svelte";
  import { workspaceStore } from "$lib/stores/workspaceStore";
  import workspacesService from "$lib/workspaces.service";
  import { onDestroy } from "svelte";
  import { invalidate, beforeNavigate } from "$app/navigation";

  export let workspaces;
  let workspaceToAdd = [];
 
  const unsubscribe = workspaceStore.subscribe((workspace) => {
    if (workspace !== undefined) {
      workspaceToAdd = [workspace];
    }
  });
  onDestroy(unsubscribe);

  beforeNavigate(({ from, to }) => {
    workspaceStore.set(); // removing the optimistic update
  });


  $: searchTerm = "";
  $: filteredWorkspaces = workspaces.concat(workspaceToAdd).filter((workspace) => {
    return (
      workspace._source.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !=
      -1
    );
  });

  function handleDeleteWorkspace(id) {
    filteredWorkspaces = filteredWorkspaces.filter((workspace) => {
      return workspace._id !== id;
    });

    if (id !== "optimistic-update") {
      workspacesService.deleteWorkspace({ id: id });
    } else {
      workspaceStore.set(); // removing the optimistic update
      invalidate();
    }
  }
</script>

<svelte:head>
  <title>Harvestore - 🔥 Workspaces</title>
</svelte:head>

<div class="container p-5">
  <header class="mb-10">
    <div class="inline-flex">
      <TitlePage title="🔥 Workspaces" />
    </div>
    <div>
      <a href={"workspaces/create"}>
        <Button title="Create Workspace" />
      </a>
    </div>
  </header>

  <main>
    <div class="mb-5">
      <input
        bind:value={searchTerm}
        type="search"
        class="shadow rounded-lg border-1 border-purple-500 focus:ring-purple-500 focus:border-purple-500"
        placeholder="Search workspace..."
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
              # References
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              # Websites
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Frequency
            </th>
            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Status
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
          {#each filteredWorkspaces as workspace, i}
            <tr class={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >{workspace._source.name}</td
              >
              <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{workspace._source.productsScope.length}</td
              >
              <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{workspace._source.websitesScope.length}</td
              >
              <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{workspace._source.frequency}</td
              >
              <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{workspace._source.status}</td
              >
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex flex-row-revers mr-5">
                  <a href={`/workspaces/update/${workspace._id}`}>
                    <button class="ml-5">✏️</button>
                  </a>
                  <button
                    class="ml-5"
                    on:click={handleDeleteWorkspace(workspace._id)}>🗑️</button
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
