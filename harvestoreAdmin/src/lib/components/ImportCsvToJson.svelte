<script>
  import { createEventDispatcher } from "svelte";
  let files;
  let fileInputCtrl;
  let parsedCsv = [];
  let isHeader = true;

  const dispatch = createEventDispatcher();
  $: dispatch("parsedCsv", {
    parsedCsv,
  });

  const clicked = () => {
    if (fileInputCtrl) fileInputCtrl.value = "";
  };

  const csvToJson = (csv) => {
    let lines = csv.split("\n");
    let results = [];

    if (isHeader) {
      lines.shift();
    }

    lines.map((line) => {
      let newLine = lineAssignment(line);
      results.push(newLine);
    });

    return results;
  };

  const lineAssignment = (line) => {
    let temp = line.split(",");
    let newLine = {
      code: temp[0].replace(/(\r\n|\n|\r)/gm, ""),
      url: temp[1].replace(/(\r\n|\n|\r)/gm, ""),
    };
    return newLine;
  };

  const loadCSV = (files) => {
    if (window.FileReader) {
      let reader = new FileReader();
      reader.readAsText(files[0]);
      const fileName = files[0].name;

      if (fileName.search("csv") > -1) {
        reader.onload = function (event) {
          let csv = event.target.result;
          parsedCsv = csvToJson(csv);
        };
      } else {
        alert(
          "Uploaded file is not a CSV. Please, make sure to import CSV, and include .csv at the end of the file."
        );
        document.getElementById("csv_file").value = null;
      }
    } else {
      alert("FileReader are not supported in this browser.");
    }
  };

  $: if (files) {
    loadCSV(files);
    console.log(isHeader);
  }
</script>

<div class="flex justify-center mt-5">
  <div class="max-w-2xl rounded-lg">
    <div class="m-4">
      <input
        class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
        type="checkbox"
        value={isHeader}
        id="headers"
        bind:checked={isHeader}
      />
      <label for="headers" class="pl-1 inline-block mb-2 text-gray-500"
        >Headers ?</label
      >
      <div class="flex items-center justify-center w-full">
        <label
          class="flex flex-col w-full h-32 border-2 border-gray-300 border-dashed rounded-md hover:bg-purple-100 hover:border-gray-300"
        >
          <div class="flex flex-col items-center justify-center pt-7">
            <svg
              class="w-8 h-8 text-gray-400 group-hover:text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p
              class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600"
            >
              Import CSV File
            </p>
          </div>
          <input
            type="file"
            class="opacity-0"
            id="csvFile"
            bind:this={fileInputCtrl}
            on:click={clicked}
            bind:files
          />
        </label>
      </div>
    </div>
    {#if parsedCsv.length > 0}
      <div class="text-gray-500 text-xs">
        <h4 class="test-gray-500 text-bold">CSV Preview</h4>
        <p>
          {#if parsedCsv.length > 0}
            The file contains {parsedCsv.length} products{/if}
        </p>
        <div
          class="flex flex-col w-full h-32 border-1 border-gray-200 rounded-md hover:bg-gray-100 hover:border-gray-200"
        >
          <table class="min-w-full divide-y divide-gray-200 text-xs text-left">
            <thead>
              <tr>
                <th>Code</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {#each parsedCsv as item, i}
                {#if i < 2}
                  <tr>
                    <td>{item.code}</td>
                    <td>{item.url.substring(0, 40)}...</td>
                  </tr>
                {/if}
              {/each}
              <tr>
                <td>...</td>
                <td>...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    {/if}
  </div>
</div>
