<script context="module">
  export async function load({ params }) {
    const productCode = params.productCode;
    return {
      props: {
        productCode,
      },
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import TitlePage from "$lib/components/titlePage.svelte";
  import ProductsService from "$lib/products.service";
  import { productStore } from "$lib/stores/productStore";

  export let productCode;
  console.log($productStore[0])

  $: product = $productStore[0]._source;

  const defineHostname = () => {
    product.matches.forEach((match) => {
      const temp = new URL(match.url);
      match.hostname = temp.hostname.replace("www.", "");
    });
  };

  const addMatch = () => {
    product.matches.push({
      url: "",
      hostname: "",
      matching: "manual",
      status: "confirmed",
    });
    product = product;
  };

  const deleteMatch = (i) => {
    if (product.matches.length > 1) {
      product.matches.splice(i, 1);
      product = product;
    }
  };

  const routeToPage = (route, replaceState) => {
    goto(`/${route}`, { replaceState });
  };

  const handleSubmit = async () => {
    defineHostname();
    let isUpdatable = true;
    for(let match of product.matches){
      if(match.url === ""){
        isUpdatable = false;
      }
    }
    if(isUpdatable){
      await ProductsService.updateProduct($productStore[0]._id, product);
      routeToPage("products", false);
    }
  };
</script>

<svelte:head>
  <title>Harvestore - 📦 Products</title>
</svelte:head>

<div class="container p-5">
  <header class="mb-10">
    <div class="inline-flex">
      <TitlePage title={`📦 Create New Product ${productCode}`} />
    </div>
  </header>

  <main>
    <div class="mb-10">
      <div class="py-10">
        <main>
          <div class=" py-10 max-w-7xl mx-auto sm:px-6 lg:px-8">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Offer Url
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Matching
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
                {#each product.matches as match, i}
                  <tr class={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
                    <td
                      class="px-6 py-4 w-4/5 whitespace-nowrap text-sm text-gray-900"
                    >
                      <input
                        bind:value={match.url}
                        type="text"
                        class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                        id="name"
                        placeholder=""
                        required
                      />
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {match.matching}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {match.status}
                    </td>
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      <button on:click={() => deleteMatch(i)}> 🗑️ </button>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </main>
        <div class="flex justify-center">
          <button
            on:click={addMatch}
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
          >
            Add
          </button>
          <button
            on:click={handleSubmit}
            class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </main>
</div>
