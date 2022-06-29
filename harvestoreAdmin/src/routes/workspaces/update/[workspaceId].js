import workspacesService from "$lib/workspaces.service";
import retailersService from "$lib/retailers.service";
import { workspaceStore } from "$lib/stores/workspaceStore";
import { retailerStore } from "$lib/stores/retailerStore";

export async function get({ params }) {
  workspaceStore.set(); // removing the optimistic update
  const workspace = await workspacesService.readWorkspace(params.workspaceId);

  retailerStore.set(); // removing the optimistic update
  const retailers = await retailersService.readRetailers();

  if (workspace.status == 200 && retailers.status == 200) {
    return {
      status: 200,
      body: {
        workspace: {
          config: workspace.data._source,
          id: workspace.data._id,
        },

        retailers: retailers.data.hits.hits,
      },
    };
  }

  return {
    status: 404,
  };
}
