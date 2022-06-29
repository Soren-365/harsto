<script>
  import { page } from "$app/stores";
  import Transition from "$lib/components/transition.svelte";
  import { supabase } from "$lib/supabase";

  import "../app.css";

  console.log( "supabase", supabase)
  supabase.auth.onAuthStateChange((_, session) => {
    user.set(session?.user);
  });
</script>

<div class="container mx-auto my-1">
  <main>
    <Transition url={$page.url}>
      <slot />
    </Transition>
  </main>
</div>
