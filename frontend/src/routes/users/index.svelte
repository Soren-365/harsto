<script context="module">
    import { supabase } from "$lib/supabase";

  /** @type {import('./__types/[slug]').Load} */
  export async function load({ params, fetch, session, stuff }) {
    const { data, error } = await supabase.from("client_user").select("*");

    console.log("data", data);
    if (error) {
      return {
        status: 404,
        props: {
          users: "error getting users",
        }
     
      };
    } else {
      return {
        status: 200,
        props: {
        users: data,
        }
      };
    }
  }
</script>

<script>
  import TitlePage from "$lib/components/titlePage.svelte";
  import Button from "$lib/components/button.svelte";
  import { userStore } from "$lib/stores/userStore";
  import usersService from "$lib/users.service";
  
  import { onDestroy } from "svelte";
  import { invalidate, beforeNavigate, afterNavigate } from "$app/navigation";
  import { goto } from "$app/navigation";  
  export let users;

  console.log("users", users);


  // let userToAdd = [];

  // const unsubscribe = userStore.subscribe((user) => {
  //   if (user !== undefined) {
  //     userToAdd = [user];
  //   }
  // });
  // onDestroy(unsubscribe);

  // added Code
  // beforeNavigate(({ from, to }) => {
  //   userStore.set(); // removing the optimistic update
  // });

  $: searchTerm = "";
  $: filteredUsers = users.filter((user) => {
    return (
      user.username.toLowerCase().indexOf(searchTerm.toLowerCase()) != -1
    );
  });

 
    function routeToPage(route, replaceState) {
    goto(`/${route}`, { replaceState });
    }

  async function handleDeleteUser(id) {
    console.log("deleting with id", id)
    filteredUsers = filteredUsers.filter((user) => {
      return user.id !== id;
    });

    if (id !== "optimistic-update") {
      await usersService.deleteUser(id);
      userStore.set()
      userToAdd = []
      invalidate() 
      routeToPage("users", true);
    } else {
     // userStore.set()
      //userToAdd = []
      invalidate();
      routeToPage("users", true);
    }
  }
</script>

<svelte:head>
  <title>Harvestore - 🛍️ Users</title>
</svelte:head>

<div class="container p-5">
  <header class="mb-10">
    <div class="inline-flex">
      <TitlePage title="🛍️ Users" />
    </div>
    <div>
      <a href={"/users/create"}>
        <Button title="Create user" />
      </a>
    </div>
  </header>

  <main>
    <div class="mb-5">
      <input
        bind:value={searchTerm}
        type="search"
        class="shadow rounded-lg border-1 border-purple-500 focus:ring-purple-500 focus:border-purple-500"
        placeholder="Search user..."
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
              Email
            </th>
            <th
            scope="col"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Password
          </th>

            <th
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              Apikey
            </th>
          </tr>
        </thead>
        <tbody>
          {#each filteredUsers as user, i}
            <tr class={i % 2 === 0 ? "bg-white" : "bg-gray-100"}>
              <td
                class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                >{user.username}</td
              >
              <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
                >{user.email}</td
              >
              <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
              >{user.password}</td
            >
            <td class="x-6 py-4 whitespace-nowrap text-sm text-gray-500"
            >{user.apikey}</td
          >

              <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
                <div class="flex flex-row-revers mr-5">
                  <a href={`/users/update/${user.id}`}>
                    <button class="ml-5">✏️</button>
                  </a>
                  <button
                  class="ml-5"
                  on:click={handleDeleteUser(user.id)}>🗑️</button
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

