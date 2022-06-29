<script>
  import { goto } from "$app/navigation";
  import retailersService from "$lib/retailers.service";
  import { Retailer } from "$lib/retailers.service";
  import Title from "$lib/components/titlePage.svelte";
  import Button from "$lib/components/button.svelte";

  import { retailerStore } from "$lib/stores/retailerStore";

  export let retailer;
  retailer = new Retailer();

  $: allCookies = [{ name: "", value: "", domain: "" }];

  const addCookie = () => {
    allCookies.push({ name: "", value: "", domain: "" });
    allCookies = allCookies;
  };

  const removeCookie = (index) => {
    allCookies.splice(index, 1);
    allCookies = allCookies;
  };

  function routeToPage(route, replaceState) {
    goto(`/${route}`, { replaceState });
  }

  const handleSubmit = async () => {
    console.log("in handle submit")
    retailer.config.cookies = allCookies;

    const retailerEntry = {
      _id: "optimistic-update",
      _index: "retailers",
      _score: 1,
      _source: retailer.config,
      _type: "_doc",
    };
    console.log("in handle submit, before route to page")
    await retailersService.createRetailer(retailer.config);

    retailerStore.set(retailerEntry);
  
    routeToPage("retailers", false);
  };
</script>

<div class="container p-5">
  <header>
    <div class="inline-flex">
      <Title title="Create Retailer" />
    </div>
  </header>

  <main class="mt-10">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-purple-600">
            Information
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Name, Hostname for visual identification, as well as the discovery
            and the crawling methodology.
          </p>
        </div>
        <div class="md:col-span-2">
          <label for="name" class="block text-sm font-medium text-gray-500 m-2"
            >Name</label
          >
          <input
            bind:value={retailer.config.name}
            name="name"
            type="text"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            id="name"
            placeholder="e.g. Medi-Market Belgium"
            required
          />

          <label
            for="hostname"
            class="block text-sm font-medium text-gray-500 m-2">Hostname</label
          >
          <input
            bind:value={retailer.config.hostname}
            type="text"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            id="hostname"
            placeholder="e.g. medi-market.be"
            required
          />

          <label
            for="discovery"
            class="block text-sm font-medium text-gray-500 m-2"
            >Discovery Mode</label
          >
          <select
            bind:value={retailer.config.discovery}
            name="discovery"
            id="discovery"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            required
          >
            <option value="csv" selected>CSV</option>
            <option disabled value="sitemap">Sitemap</option>
            <option disabled value="spider">Spider</option>
            <option disabled value="bing">Bing Api</option>
          </select>

          <label
            for="extraction"
            class="block text-sm font-medium text-gray-500 m-2"
            >Extraction Mode</label
          >
          <select
            bind:value={retailer.config.extraction}
            name="extraction"
            id="extraction"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            required
          >
            <option value="puppeteer" selected>Puppeteer</option>
            <option value="request">http request (axios)</option>
          </select>
        </div>
      </div>

      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-purple-600">
            Selectors
          </h3>
          <p class="mt-1 text-sm text-gray-500 mb-2">
            CSS Selectors to parse crawled HTML body. Code must contain the CSS
            selector code, the Element Property would include innerText, or
            Content, etc. While RegEx are used to clean parsed value by
            replacing or by executing.
          </p>
        </div>
        <div class="md:col-span-2">
          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              isOffer
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.isOffer.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.isOffer.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.isOffer.regex.method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.isOffer.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.isOffer.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Language
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.language.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.language.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.language.regex.method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.language.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.language.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Reference Code
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.code.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.code.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.code.regex.method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.code.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.code.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">Image</h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.image.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.image.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.image.regex.method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.image.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.image.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">Title</h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.title.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.title.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.title.regex.method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.title.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.title.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">Brand</h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.brand.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.brand.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.brand.regex.method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.brand.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.brand.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Availability
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.availability.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.availability.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.availability.regex
                    .method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.availability.regex
                    .regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.availability.regex
                    .group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Price (Current)
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.priceCurrent.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.priceCurrent.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.priceCurrent.regex
                    .method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.priceCurrent.regex
                    .regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.priceCurrent.regex
                    .group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Price (MAP)
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.priceMap.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.priceMap.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.priceMap.regex.method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.priceMap.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.priceMap.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Price (Discount)
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.priceDiscount.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.priceDiscount.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.priceDiscount.regex
                    .method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.priceDiscount.regex
                    .regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.priceDiscount.regex
                    .group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Description
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.description.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.description.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.description.regex
                    .method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.description.regex.regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.description.regex.group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Reviews (Score)
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsScore.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsScore.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.reviewsScore.regex
                    .method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsScore.regex
                    .regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsScore.regex
                    .group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          <div class="mb-3">
            <h3 class="text-lg font-medium leading-6 text-purple-600">
              Reviews (Number)
            </h3>
            <div class="md:grid md:grid-cols-2 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Code</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsNumber.selector}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="code"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Property</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsNumber.property}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="code"
                  placeholder=""
                />
              </div>
            </div>
            <div class="md:grid md:grid-cols-3 md:gap-6">
              <div class="md:col-span-1">
                <label
                  for="regex"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx Usage</label
                >
                <select
                  bind:value={retailer.config.selectors.reviewsNumber.regex
                    .method}
                  name="extraction"
                  id="extraction"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                >
                  <option value="" selected>No RegEx</option>
                  <option value="replace"
                    >selectorRawValue.replace(regex, '')</option
                  >
                  <option value="exec">regex.exec(selectorRawValue)</option>
                </select>
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexCode"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >RegEx</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsNumber.regex
                    .regex}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexCode"
                  placeholder=""
                />
              </div>
              <div class="md:col-span-1">
                <label
                  for="regexGroup"
                  class="block text-sm font-medium text-gray-500 m-2"
                  >Group</label
                >
                <input
                  bind:value={retailer.config.selectors.reviewsNumber.regex
                    .group}
                  type="text"
                  class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                  id="regexGroup"
                  placeholder=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cookies -->
      <div class="md:grid md:grid-cols-3 md:gap-6">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-600">Cookies</h3>
          <p class="mt-1 text-sm text-gray-500">
            Sometimes, websites may require cookies for language, country,
            location, etc.
          </p>
        </div>
        <div class="md:col-span-2">
          <div class="md:grid md:grid-cols-4 md:gap-6">
            {#each allCookies as cookie, index}
              <div class="md:col-span-4">
                <div>
                  <label
                    for="cookies"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Cookie # {index + 1}
                  </label>
                  <div class="mt-1 flex items-center rounded-md">
                    <div class="inline-flex align-middle space-x-3">
                      <label
                        for="code"
                        class="text-sm font-medium text-gray-500 m-2"
                        >Name</label
                      >
                      <input
                        bind:value={cookie.name}
                        type="text"
                        class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                        id="code"
                      />

                      <label
                        for="code"
                        class="text-sm font-medium text-gray-500 m-2"
                        >Value</label
                      >
                      <input
                        bind:value={cookie.value}
                        type="text"
                        class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                        id="code"
                      />

                      <label
                        for="code"
                        class="text-sm font-medium text-gray-500 m-2"
                        >Domain</label
                      >
                      <input
                        bind:value={cookie.domain}
                        type="text"
                        class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
                        id="code"
                      />

                      <button
                        on:click={addCookie}
                        type="button"
                        class="py-2 px-4 text-sm font-medium text-white border border-transparent shadow-sm rounded-md mb-5 bg-purple-500 hover:bg-purple-800 "
                        >+</button
                      >
                      {#if allCookies.length > 1}
                        <button
                          on:click={() => removeCookie(index)}
                          type="button"
                          class="py-2 px-4 text-sm font-medium text-white border border-transparent shadow-sm rounded-md mb-5 bg-pink-300 hover:bg-pink-800 "
                          >-</button
                        >
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            {/each}
          </div>
        </div>
      </div>

      <div class="flex justify-center mb-20">
        <Button title="Create" />
      </div>
    </form>
  </main>
</div>
