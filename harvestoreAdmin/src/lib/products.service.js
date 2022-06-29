import api from "./http-common";

export default new (class WorkspacesService {
  //Create Product
  createProduct(product) {
    return api.post("product/create", product);
  }

  //Read Product
  readProductByCode(code) {
    return api.get(`product/read/${code}`);
  }

  //Read Products
  readProducts() {
    return api.get("products/read");
  }

  //Update Product
  updateProduct(id, product) {
    return api.put(`product/update/${id}`, product);
  }

  //Bulk Import Products
  importCsv(products) {
    return api.post("products/csvimport", products);
  }
})();
