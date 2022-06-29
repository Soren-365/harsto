<script>
  import KpiCard from "$lib/components/kpiCard.svelte";
  import TitlePage from "$lib/components/titlePage.svelte";

  export let retailers;
  export let workspaces;
  export let products;

  export const kpis = [
    { title: "🛍️  Retailers", kpi: retailers },
    { title: "🔥  Workspaces", kpi: workspaces },
    { title: "📦  Products", kpi: products },
    { title: "🥕  Crawler Queue Length", kpi: 0 },
    { title: "⏰  Est. Remaining Time", kpi: 0 },
  ];
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<div class="container p-5">
  <header>
    <div class="inline-flex">
      <TitlePage title="Dashboard" />
    </div>
  </header>

  <main class="mb-10">
    <div class="container max-h-full">
      <div class="grid grid-cols-3 gap-10">
        {#each kpis as kpi}
          <KpiCard title={kpi.title} kpi={kpi.kpi} />
        {/each}
      </div>
    </div>
  </main>
</div>
