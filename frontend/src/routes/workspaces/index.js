import { workspaceStore } from "$lib/stores/workspaceStore";
import workspacesService from "$lib/workspaces.service";

export async function get() {
  workspaceStore.set(); // Removing Optimistic Update
  const workspaces = await workspacesService.readWorkspaces();


  if (workspaces.status == 200) {
    return {
      status: 200,
      body: {
        workspaces: workspaces.data.hits.hits,
      },
    };
  }

  return {
    status: 404,
  };
}
