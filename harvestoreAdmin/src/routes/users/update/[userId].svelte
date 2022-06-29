<script context="module">
  import { supabase } from "$lib/supabase";
  import workspacesService from "$lib/workspaces.service";

  /** @type {import('./__types/[slug]').Load} */
  export async function load({ params, props, fetch, session, stuff }) {
    // console.log("userId", params.userId);
    console.log("props", props)

    const { data: workspace } = await supabase
      .from("workspace")
      .select("elastic_id")
      .match({ client_user_id: params.userId });

    //console.log("first data", workspace)

    let { data: client_user, error } = await supabase.from("client_user").select("*").match({ id: params.userId });;

    console.log("client_user", client_user);
    // console.log("workspaceIds", workspaceIds)

    const workspaces = workspace.map((entry) => {
      return workspacesService.readWorkspace(entry.elastic_id);
    });

  
    let workspaceObjects = [];
    Promise.all(workspaces)
      .then((results) => {
        results.forEach((result) => {
          // console.log("result ", result.data )
          workspaceObjects.push(result.data);
        });
      })
      .catch((error) => {
        console.log("error in promise.all ", error);
      });

     // console.log("workspaces ", workspaceObjects )

     const { data } = await supabase.from("workspace").select("*");
    
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
          user: "error getting client user",
          workspaces: "error",
          freeWorkspaces: freeWorkspaces
        },
      };
    }
    return {
      status: 200,
      props: {
        user: client_user[0],
        workspaces: workspaceObjects,
        freeWorkspaces, freeWorkspaces
      },
    };
  }
</script>

<script>
  import { goto } from "$app/navigation";
  import usersService from "$lib/users.service";
  import Title from "$lib/components/titlePage.svelte";
  import Button from "$lib/components/button.svelte";

  export let user;
  export let workspaces;
  export let freeWorkspaces;
  user.workspaces = workspaces
  workspaces.forEach( entry => {
    entry.isUserWorkspace = true }
  )
  let combinedWorkspaces = workspaces.concat(freeWorkspaces)
//  console.log("combinedWorkspaces", combinedWorkspaces)
  let checked = true

 

  console.log("workspaces", workspaces)
  // const addCookie = () => {
  //   allCookies.push({ name: "", value: "", domain: "" });
  //   allCookies = allCookies;
  // };

  // const removeCookie = (index) => {
  //   allCookies.splice(index, 1);
  //   allCookies = allCookies;
  // };

  function join(workspaces) {
 //   console.log("woskd",workspaces)
return workspaces.map( entry => {
  return entry._id
})
	}

  function routeToPage(route, replaceState) {
    goto(`/${route}`, { replaceState });
  }

  const handleSubmit = async () => {
    //console.log("user in user update", user)
    const workspacesIdsToAdd = user.workspaces.map( workspace => {
        if(!workspaces.find( wksp => wksp === workspace))
        return workspace
    }).filter( entry => entry !== undefined).map( workspace => workspace._id)

    const workspacesIdsToDelete = workspaces.map( workspace => {
      if(!user.workspaces.find( wksp => wksp === workspace))
      return workspace
    }).filter( entry => entry !== undefined).map( workspace => workspace._id)

    // console.log("workspacesToAdd", workspacesIdsToAdd)
    // console.log("workspacesToDelete", workspacesIdsToDelete)

  usersService.updateUser(user.id, user, workspacesIdsToAdd, workspacesIdsToDelete);
  routeToPage("users", false);
  };
</script>

<div class="container p-5">
  <header>
    <div class="inline-flex">
      <Title title="Update User" />
    </div>
  </header>

  <main class="mt-10">
    <form on:submit|preventDefault={handleSubmit}>
      <div class="md:grid md:grid-cols-3 md:gap-6 mb-10">
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
            placeholder="e.g. medi-market.be"
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

          <label
            for="apikey"
            class="block text-sm font-medium text-gray-500 m-2">Api-key</label
          >
          <input
            bind:value={user.apikey}
            type="text"
            class="w-full text-sm focus:ring-purple-600 focus:border-purple-600 rounded-lg border-gray-200 mb-5"
            id="apikey"
            placeholder="e.g. medi-market.be"
            required
          />
        </div>
      </div>

      <div class="md:grid md:grid-cols-3 md:gap-10 mb-10">
        <div class="md:col-span-1">
          <h3 class="text-lg font-medium leading-6 text-gray-600">
            Non attached workspaces 
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Check one or more workspace(s) to connect to user
          </p>
        
 
      </div>
      <div class="md:col-span-2">
        {#each combinedWorkspaces as workspace}
          <div class="flex items-center h-5 mb-2">
            <input
              bind:group={user.workspaces}
              value={workspace}
              bind:checked={workspace.isUserWorkspace}
              type="checkbox"
              class="focus:ring-purple-500 h-4 w-4 text-purple-600 border-gray-300 rounded"
          
            />
            <label for="retailer" class="text-gray-600 m-3"
              >{workspace._source.name}</label
            >
          </div>
        {/each}
               <!-- <p>{ join(user.workspaces) }</p> // logout of new workspaces list--> 
      </div>
    </div>
      <div class="flex justify-center mb-20">
        <div class="m-3">
          <Button title="Update" />
        </div>
        <div class="m-3">
          <a href={"/users"}>
            <Button title="Cancel" />
          </a>
        </div>
    
    </form>
  </main>
</div>
