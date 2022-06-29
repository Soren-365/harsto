import api from "./http-common";

export class Workspace {
  constructor(){
      this.config = {
          name: '',
          type: 'ecommerce',
          productsScope: [],
          websitesScope: [],
          frequency: '',
          startDate: '',
          nextCrawl: '',
          status: 'on',
      }
  }
}

export default new (class WorkspacesService {
  //Create Workspace
  createWorkspace(workspace) {
    return api.post("workspace/create", workspace);
  }

  //Read Workspaces
  readWorkspaces() {
    return api.get("workspaces/read");
  }

  //Read Workspace
  readWorkspace(id) {
    return api.get(`workspace/read/${id}`);
  }

  //Update Workspace
  updateWorkspace(id, workspace) {
    return api.put(`workspace/update/${id}`, workspace);
  }

  //Delete Workspace
  deleteWorkspace(id) {
    return api.post("workspace/delete", id);
  }
})();
