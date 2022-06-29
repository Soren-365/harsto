<script>
  import { goto } from "$app/navigation";
  import workspacesService from "$lib/workspaces.service";
  import Title from "$lib/components/titlePage.svelte";
  import Button from "$lib/components/button.svelte";
  import DatePicker from "$lib/components/DatePicker.svelte";
  import moment from "moment";

  export let workspace;
  export let retailers;

  const assignStartDate = (e) => {
    workspace.config.startDate = new Date(e.detail.datepicked);
  };

  const deparseProductsCodes = () => {
    workspace.config.productsScope = workspace.config.productsScope.toString();
  };
  deparseProductsCodes();

  const parseProductsCodes = () => {
    let temp = workspace.config.productsScope.replace(/ /g, "");
    temp.slice(-1) === "," ? (temp = temp.slice(0, -1)) : (temp = temp);
    workspace.config.productsScope = temp.split(",");
  };

  const nextCrawlDate = () => {
    switch (workspace.config.frequency) {
      case "daily":
        workspace.config.nextCrawl = new Date(
          moment(workspace.config.startDate).add(1, "days").format()
        );
        break;

      case "weekly":
        workspace.config.nextCrawl = new Date(
          moment(workspace.config.startDate).add(1, "weeks").format()
        );
        break;

      case "monthly":
        workspace.config.nextCrawl = new Date(
          moment(workspace.config.startDate).add(1, "months").format()
        );
        break;
    }
  };

  function routeToPage(route, replaceState) {
    goto(`/${route}`, { replaceState });
  }

  const handleSubmit = async () => {
    parseProductsCodes();
    nextCrawlDate();
    workspacesService.updateWorkspace(workspace.id, workspace);
    routeToPage("workspaces", false);
  };
</script>

<svelte:head>
  <title>Harvestore - 🔥 Workspaces</title>
</svelte:head>

<div class="container p-5">
  <header>
    <div class="inline-flex">
      <Title title="Create Workspace" />
    </div>
  </header>

  <main class="mt-10">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="md:grid md:grid-cols-3 md:gap-6 mb-10">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-600">
            Information
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Name, Frequency, and other workspace options.
          </p>
        </div>
        <div class="md:col-span-2">
          <div class="md:grid md:grid-cols-3 md:gap-6">
            <div class="md:col-span-1">
              <label
                for="name"
                class="block text-sm font-medium text-gray-500 m-2">Name</label
              >
              <input
                bind:value={workspace.config.name}
                type="text"
                class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                id="name"
                placeholder=""
                required
              />
            </div>
            <div class="md:col-span-1">
              <label
                for="regex"
                class="block text-sm font-medium text-gray-500 m-2"
                >Frequency</label
              >
              <select
                bind:value={workspace.config.frequency}
                name="frequency"
                id="frequency"
                class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                required
              >
                <option value="daily" selected>Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div class="md:col-span-1">
              <label
                for="discovery"
                class="block text-sm font-medium text-gray-500 m-2"
                required>Start Date</label
              >
              <DatePicker on:datepicked={assignStartDate} />
            </div>
          </div>
        </div>
      </div>
      <div class="md:grid md:grid-cols-3 md:gap-6 mb-10">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-600">
            Products Scope
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            List Refence Code the Workspace must include (GTIN13, EAN, or CNK).
            Avoid mixing different types of codes. Codes must be separated by a
            coma (",").
          </p>
        </div>
        <div class="md:col-span-2">
          <label for="regex" class="block text-sm font-medium text-gray-500 m-2"
            >Reference Codes</label
          >
          <div class="mt-1">
            <textarea
              bind:value={workspace.config.productsScope}
              rows="10"
              name="products"
              id="products"
              class="focus:ring-purple-500 focus:border-purple-500 block w-full sm:text-sm border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
      </div>
      <div class="md:grid md:grid-cols-3 md:gap-6 mb-10">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-600">
            Retailers Scope
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Check retailers to be monitored.
          </p>
        </div>
        <div class="md:col-span-2">
          {#each retailers as retailer}
            <div class="flex items-center h-5 mb-2">
              <input
                bind:group={workspace.config.websitesScope}
                value={retailer._source.hostname}
                type="checkbox"
                class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
              />
              <label for="retailer" class="text-gray-600 m-3"
                >{retailer._source.name}</label
              >
            </div>
          {/each}
        </div>
      </div>

      <div class="flex justify-center mb-20">
        <Button title="Create" />
      </div>
    </form>
  </main>
</div>
