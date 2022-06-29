import Router from 'express-promise-router'
import pgdb from '../config/supabase_direct_pg.js'
// create a new express-promise-router
// this has the same API as the normal express router except
// it allows you to use async functions as route handlers
const router = new Router()
// export our router to be mounted by the parent application


router.get('/users', async (req, res) => {
  console.log("getting client users...")
  const { id } = req.params

  const query = `SELECT * FROM client_user;`;

  const response = await pgdb.query(query)
 //console.log("response rows", response.rows)
  res.status(200).send({ data: response.rows })
})

export default router


