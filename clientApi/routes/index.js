import  users from './users.js'
import  workspaces from './workspaces.js'
import workspace from './workspace.js'

const routes = (app) => {
  app.use('/api', users)
  app.use('/api', workspaces)
  app.use('/api', workspace)
}

export default routes