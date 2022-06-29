import retailersService from "$lib/retailers.service";

export async function get({ params }) {
  const retailer = await retailersService.readRetailer(params.retailerId);
  if (retailer.status == 200) {
    return {
      status: 200,
      body: {
        retailer: {
          config: retailer.data._source,
          id: retailer.data._id,
        },
      },
    };
  }

  return {
    status: 404,
  };
}
