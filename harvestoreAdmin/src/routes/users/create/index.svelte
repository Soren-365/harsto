<script context="module">
  import { supabase } from "$lib/supabase";

  /** @type {import('./__types').Load} */
  export async function load({ props }) {
    const { data, error } = await supabase.from("workspace").select("*");
    
    const reservedWorkspaceIds = data.map((workspace) => workspace.elastic_id);
  
    const freeWorkspaces = props.workspaces.filter((workspace) => {
      return !reservedWorkspaceIds.some((reservedId) => {
        console.log("reservedId, workspace.id", reservedId, workspace.id);
        return reservedId === workspace._id;
      });
    });

    console.log("freeWorkspaces", freeWorkspaces);

    if (error) {
      return {
        status: 404,
        props: {
           workspaces: "error getting workspaces"
        }
      };
    } else {
    return {
      status: 200,
      props: {
        workspaces: freeWorkspaces,
      },
    };
  }
}
</script>

<script>
  import { goto } from "$app/navigation";
  import usersService from "$lib/users.service";
  import Title from "$lib/components/titlePage.svelte";
  import Button from "$lib/components/button.svelte";
  import { userStore } from "$lib/stores/userStore"
  export let workspaces = [];

  let user = {
    username: "",
    email: "",
    password: "password",
  };

  let client_user_workspaces = [];

  console.log("workspaces", workspaces);

  function routeToPage(route, replaceState) {
    goto(`/${route}`, { replaceState });
  }

  const handleSubmit = async () => {
  
    await usersService.createUser(user, client_user_workspaces);
    // user.id = "optimistic-update"
    // userStore.set(user)
    routeToPage("users", false);
  };


  // const handleSubmit = async () => {

  //   const workspaceEntry = {
  //     _id: "optimistic-update",
  //     _index: "workspaces",
  //     _score: 1,
  //     _source: workspace.config,
  //     _type: "_doc",
  //   };

  //   workspacesService.createWorkspace(workspace.config);
  //   workspaceStore.set(workspaceEntry);
  //   routeToPage("workspaces", false);
  // };


</script>

<div class="container p-5">
  <header>
    <div class="inline-flex">
      <Title title="Update User" />
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
            Name, Email, Password, Apikey. Password is not implemented and the
            apikey is sent to user manually.
          </p>
        </div>
        <div class="md:col-span-2">
          <label for="name" class="block text-sm font-medium text-gray-500 m-2"
            >Name</label
          >
          <input
            bind:value={user.username}
            name="username"
            type="text"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            id="name"
            placeholder={user.username}
            required
          />

          <label for="email" class="block text-sm font-medium text-gray-500 m-2"
            >Email</label
          >
          <input
            bind:value={user.email}
            type="text"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            id="email"
            placeholder="email"
            required
          />
          <label
            for="password"
            class="block text-sm font-medium text-gray-500 m-2">Password</label
          >
          <input
            bind:value={user.password}
            type="text"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            id="password"
            placeholder="e.g. medi-market.be"
            required
          />
        </div>
      </div>

      <div class="md:grid md:grid-cols-3 md:gap-6 mb-10">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-600">
            Non attached workspaces 
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Check one or more workspace(s) to connect to user
          </p>
        </div>
        
        <div class="md:col-span-2">
          {#each workspaces as workspace}
            <div class="flex items-center h-5 mb-2">
              <input
                bind:group={client_user_workspaces}
                value={workspace._id}
                type="checkbox"
                class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
              />
              <label for="workspace" class="text-gray-600 m-3"
                >{workspace._source.name}</label
              >
            </div>
          {/each}
        </div>
      </div>

      <div class="flex justify-center mb-20">
        <div class="m-3">
          <Button title="Create new user" />
        </div>
        <div class="m-3">
          <a href={"/users"}>
            <Button title="Cancel" />
          </a>
        </div>
      </div>
    </form>
  </main>
</div>
