import retailersService from "$lib/retailers.service";
import { retailerStore } from "$lib/stores/retailerStore";

export async function get(){
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