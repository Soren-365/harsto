<script>
  import { page } from "$app/stores";
  import Navigation from "$lib/components/navigation.svelte";
  import Transition from "$lib/components/transition.svelte";
  import {supabase} from "$lib/supabase";
  import { user } from '$lib/stores/authStore';
  import SignIn from './auth/SignIn@auth.svelte';
  import SignUp from './auth/SignUp@auth.svelte';
  import "../app.css";

  user.set(supabase.auth.user());

  let alreadySignedUp = true;
    const toggleSign = () => {
        alreadySignedUp = !alreadySignedUp;
    };

  supabase.auth.onAuthStateChange((_, session) => {
    user.set(session?.user);
  });
</script>

<div class="container mx-auto my-1">
  {#if $user}
  <div class="container">
    <Navigation />
  </div>
  <main class="container bg-white my-5 rounded-lg shadow-xl">
    <Transition url={$page.url}>
      <slot />
    </Transition>
  </main>
  {:else}
    {#if !alreadySignedUp}
      <Transition url={$page.url}>
        <SignUp on:message={toggleSign}/>
    </Transition>
    {:else}
      <Transition url={$page.url}>
      <SignIn on:message={toggleSign}/>
      </Transition>
    {/if}
  {/if}
</div>