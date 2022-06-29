import retailersService from "$lib/retailers.service";
import { retailerStore } from "$lib/stores/retailerStore";

export async function get(){
    console.log("all retailers host address", import.meta.env.VITE_API_HOST)
    console.log("production", import.meta.env.VITE_NODE_ENV)
    retailerStore.set()  // removing the uptimistic update
    const retailers = await retailersService.readRetailers();
    if(retailers.status == 200){
        return {
            status: 200,
            body: {
                retailers: retailers.data.hits.hits
            }
        }
    }

    return {
        status: 404
    }
}