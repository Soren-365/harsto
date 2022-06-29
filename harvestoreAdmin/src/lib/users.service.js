import { supabase } from "$lib/supabase";

export class User {
  constructor() {
    this.config = {
      name: "",
      email: "",
      apiKey: "",
      selectors: {
        isLocked: {
          selector: "",
          property: "",
          regex: {
            regex: "",
            method: "",
            group: "",
          },
        },
      },
      cookies: [],
    };
  }
}

export default new (class UserService {
  //Create
  async createUser(user, client_user_workspaces) {
    const { data, error } = await supabase
      .from("client_user")
      .insert([
        { username: user.username, email: user.email, password: user.password },
      ]);

    if (error) {
      console.log("error at user insert", error);
      return { status: 500 };
    }

    const userReturnData = data;
console.log("client user workspaces", client_user_workspaces)
    client_user_workspaces.forEach(async (client_user_workspace) => {
      const { data, error } = await supabase.from("workspace").insert([
        {
          elastic_id: client_user_workspace,
          client_user_id: userReturnData[0].id,
        },
      ]);
    });
    if (!error) {
      return { status: 200 };
    } else {
      console.log("error at workspace user ref. insert:", error);
      return { status: 500 };
    }
  }

  //Read All retailers
  readUsers() {
    return api.get("users/read");
  }

  //Read 1 User by id
  readUser(id) {
    return api.get(`user/read/${id}`);
  }

  //Update 1 User by id
  async updateUser(id, user, workspaceIdsToAdd, workspaceIdsToDelete) {
    console.log("id, user", id, user);
    workspaceIdsToAdd.forEach(async (client_user_workspace) => {
      const { data, error } = await supabase.from("workspace").insert([
        {
          elastic_id: client_user_workspace,
          client_user_id: id,
        },
      ]);
    });

    workspaceIdsToDelete.forEach(async (client_user_workspace) => {
      const { data, error } = await supabase.from("workspace").delete().match(
        {
          elastic_id: client_user_workspace,
          client_user_id: id,
        },
      );
    });

    const { data, error } = await supabase
      .from("client_user")
      .update({
        username: user.username,
        email: user.email,
        password: user.password,
        apikey: user.apikey,
      })
      .eq("user.id", id);
    return data;
  }

  //Delete 1 User by id
  async deleteUser(id) {
    const { data, error } = await supabase
      .from("client_user")
      .delete()
      .match({ id: id });

      if (!error) {
        return { status: 200};
      } else {
        return { status: 500};
      }
   
  }
})();
