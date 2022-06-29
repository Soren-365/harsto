<script>
  import { SyncLoader } from "svelte-loading-spinners"; //loading spinner
  import Debugger from "$lib/debugger.service";
  import TitlePage from "$lib/components/titlePage.svelte";
  import moment from "moment";

  let isLoading = false;
  let isResults = false;
  let timestamp1 = "";
  let timestamp2 = "";
  let query = "";
  let results = "";

  let myInterval = "";
  const refreshTime = 1000;

  const checkingResults = async () => {
    console.log("checking results...");
    myInterval = setInterval(async () => {
      await getResults();
    }, refreshTime);
  };

  const getResults = async () => {
    try {
      results = await Debugger.readCrawlResults({
        msg: query,
      });

      timestamp2 = results.data.hits.hits[0]._source.offer.lastCrawl;

      if (moment(timestamp2).format() > timestamp1) {
        results = results.data.hits.hits[0]._source;
        isLoading = false;
        isResults = true;
        clearInterval(myInterval);
      }
    } catch (error) {
      console.log("Waiting for crawling results...", error);
    }
  };

  const debug = async () => {
    isLoading = true;
    timestamp1 = moment().format();
    try {
      Debugger.debug({
        msg: query,
        queueName: "debugger",
      });
    } catch (error) {
        console.log(error)
    }
    await checkingResults();
  };
</script>

<svelte:head>
  <title>Harvestore - 🩺 Debugger</title>
</svelte:head>

<div class="container p-5">
  <header class="mb-10">
    <div class="inline-flex">
      <TitlePage title="🩺 Debugger" />
    </div>
  </header>

  <main>
    <div class="mb-10">
      <div class="mb-10">
        <label class="block mb-2">
          <input
            bind:value={query}
            type="text"
            class="shadow rounded-lg border-1 border-purple-500 focus:ring-purple-500 focus:border-purple-500 w-full"
            placeholder="URL to debug..."
          />
        </label>
        <div class="text-center">
          <button
            on:click={debug}
            class="inline-flex items-center px-4 py-2 border rounded-md shadow-md text-white bg-purple-500 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >Debug</button
          >
        </div>
      </div>
    </div>
    <div>
      {#if isLoading}
      <div class="flex justify-center items-center">
            <SyncLoader size="50" color="#a855f7" unit="px" duration="1s" />
          </div>
      {:else}
        {#if isResults}
        <pre class="overflow-scroll">
            {JSON.stringify(results, null, 2)}
        </pre>
        {/if}
      {/if}
    </div>
  </main>
</div>
