<script>
  import { supabase } from "$lib/supabase";
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.log(error);
    }
  };

  export const menu = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Retailers", href: "/retailers" },
    { name: "Workspaces", href: "/workspaces" },
    { name: "Products", href: "/products" },
    { name: "Users", href: "/users" },
    { name: "Debugger", href: "/debugger" },
  ];
</script>

<nav class="bg-white shadow-xl mx-auto rounded-lg">
  <div class="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
    <div class="relative flex justify-between h-16">
      <div
        class="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start"
      >
        <!-- Logos -->
        <div class="flex-shrink-0 flex items-center">
          <a href="/">
            <img
              class="block lg:hidden h-8 w-auto"
              src="https://fav.farm/🚀"
              alt="Workflow"
            />
            <img
              class="hidden lg:block h-8 w-auto"
              src="https://fav.farm/🚀"
              alt="Workflow"
            />
          </a>
        </div>

        <!-- menu -->
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          {#each menu as item}
            <a
              href={item.href}
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
            >
              {item.name}
            </a>
          {/each}
          <button
            on:click={signOut}
            class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
          >
            ❌
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
