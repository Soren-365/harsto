import Router from "express-promise-router";
import pgdb from '../config/supabase_direct_pg.js'
import elasticApi from "../config/http-elastic.js";
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router();
// export our router to be mounted by the parent application

router.get("/:token/getWorkspaces", async (req, res) => {
  const { token } = req.params;

  const query1 = `SELECT id FROM client_user WHERE apikey=$1;`;
  const values1 = [token];
  const response1 = await pgdb.query(query1, values1, res, "Incorrect Api token");

  const query2 = `SELECT elastic_id FROM workspace WHERE client_user_id=$1;`;
  const values2 = [response1.rows[0].id];
  const response2 = await pgdb.query(query2, values2);

  const workspaceIds = response2.rows.map((row) => {
    return row.elastic_id;
  });

  const workspaces_promises = workspaceIds.map(async (workspaceId) => {
    const workspace_raw = await elasticApi.get(`workspace/read/${workspaceId}`);
    //console.log("workspace_raw", workspace_raw.data);
    return workspace_raw.data;
  });

  const workspaces = await Promise.all(workspaces_promises);

  const responseObject = {
    workspaces: workspaces.map((workspace) => {
      return {
        id: workspace._id,
        title: workspace._source.name,
        productscount: workspace._source.productsScope.length,
      };
    }),
  };

  res.status(200).send({ data: responseObject });
});

export default router;
