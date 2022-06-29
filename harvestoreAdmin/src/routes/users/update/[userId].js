import workspacesService from "$lib/workspaces.service";
import { workspaceStore } from "$lib/stores/workspaceStore";

export async function get() {
  workspaceStore.set(); // removing the optimistic update
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