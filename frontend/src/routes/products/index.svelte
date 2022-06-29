<script>
  import { goto } from "$app/navigation";
  import { SyncLoader } from "svelte-loading-spinners"; //loading spinner
  import ProductsService from "$lib/products.service";
  import TitlePage from "$lib/components/titlePage.svelte";
  import ImportCsvToJson from "$lib/components/ImportCsvToJson.svelte";
  import { productStore } from "$lib/stores/productStore";

  let productCode;

  let isImporting = false;
  let isProduct = true;

  $: parsedCsv = [];

  const assignParsedCsv = (e) => {
    parsedCsv = e.detail.parsedCsv;
  };

  const routeToPage = (route, replaceState) => {
    goto(`/${route}`, { replaceState });
  };

  const handleExplorer = async () => {
    try {
      const product = await ProductsService.readProductByCode(productCode);
      if (product.data.hits.hits.length === 0) {
        isProduct = false;
      } else {
        productStore.set(product.data.hits.hits);
        routeToPage(`products/update/${productCode}`, false);
      }
    } catch (error) {
      console.log(
        `Error occured while searching for the reference code : ${productCode}`,
        error
      );
    }
  };

  const handleImport = async () => {
    isImporting = true;
    try {
      const receipt = await ProductsService.importCsv(parsedCsv);
      if (receipt.status === 200) {
        isImporting = false;
        alert("Import successful!");
      }
    } catch (error) {
      isImporting = false;
      alert("Import failed!");
    }
  };
</script>

<svelte:head>
  <title>Harvestore - 📦 Products</title>
</svelte:head>

<div class="container p-5">
  <header class="mb-10">
    <div class="inline-flex">
      <TitlePage title="📦 Products" />
    </div>
  </header>

  <main>
    <div class="mb-10">
      <div class="mb-10">
        <h3 class="m-2 leading-6 font-medium text-gray-500 content-center">
          🔎 Explorer
        </h3>
        <label class="block mb-2">
          <input
            bind:value={productCode}
            type="text"
            class="shadow text-center rounded-lg border-1 border-purple-500 focus:ring-purple-500 focus:border-purple-500 w-full"
            placeholder="Type a reference code..."
          />
        </label>
        <div class="text-center">
          {#if !isProduct}
            <p class="text-xs text-red-500 mb-5">
              This product doesn't exist in the database.
            </p>
          {/if}
          <button
            on:click={handleExplorer}
            class="inline-flex items-center px-4 py-2 border rounded-md shadow-md text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >Search</button
          >
          {#if !isProduct}
            <a href={`/products/create/${productCode}`}>
              <button
                class="inline-flex items-center px-4 py-2 border rounded-md shadow-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >Create</button
              >
            </a>
          {/if}
        </div>
      </div>

      <div class="mb-10">
        <h3 class="m-2 leading-6 font-medium text-gray-500 content-center">
          🏋🏼 Import CSV
        </h3>
        <p class="m-2 text-gray-500 text-xs">
          ⚠️ CSV Files must contain 2 columns: "code" & "url". Separator to be
          used is "," only!
        </p>
        {#if !isImporting}
          <div>
            <ImportCsvToJson on:parsedCsv={assignParsedCsv} />
          </div>
          {#if parsedCsv.length > 0}
            <div class="text-center">
              <button
                on:click={handleImport}
                class="inline-flex items-center px-4 py-2 border rounded-md shadow-md text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >Import</button
              >
            </div>
          {/if}
        {:else}
          <div class="flex justify-center items-center">
            <SyncLoader size="50" color="#a855f7" unit="px" duration="1s" />
          </div>
        {/if}
      </div>
    </div>
  </main>
</div>
