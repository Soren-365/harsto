import retailersService from "$lib/retailers.service";
import workspacesService from "$lib/workspaces.service";
import productsService from "$lib/products.service";

export async function get() {
  //Retailers Stats
  const retailers = await retailersService.readRetailers();

  //Workspaces Stats
  const workspaces = await workspacesService.readWorkspaces();

  //Products Stats
  const products = await productsService.readProducts();

  if (
    retailers.status == 200 &&
    workspaces.status == 200 &&
    products.status == 200
  ) {
    return {
      status: 200,
      body: {
        retailers: retailers.data.hits.hits.length,
        workspaces: workspaces.data.hits.hits.length,
        products: products.data.hits.hits.length,
      },
    };
  }

  return {
    status: 404,
  };
}
