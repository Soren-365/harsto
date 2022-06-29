import api from "./http-common";

export class Retailer {
  constructor(){
      this.config = {
          name: '',
          hostname: '',
          discovery: '',
          extraction: '',
          proxies: true,
          selectors: {
              isOffer: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              language: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              code: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              image: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              title: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              brand: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              availability: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              priceCurrent: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              priceMap: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              priceDiscount: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              description: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              reviewsScore: {
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
              reviewsNumber: { 
                  selector: '',
                  property: '',
                  regex: {
                      regex: '',
                      method: '',
                      group: '',
                  },
              },
          },
          cookies: [],
      }
  }
}

export default new (class RetailerService {
  //Create
  createRetailer(retailer) {
    return api.post("retailer/create", retailer);
  }

  //Read All retailers
  readRetailers() {
     
    return api.get("retailers/read");
  }

  //Read 1 retailer by id
  readRetailer(id) {
    return api.get(`retailer/read/${id}`);
  }

  //Update 1 retailer by id
  updateRetailer(id, retailer) {
    return api.put(`retailer/update/${id}`, retailer);
  }

  //Delete 1 retailer by id
  deleteRetailer(id) {
    return api.post("retailer/delete", id);
  }
})();
