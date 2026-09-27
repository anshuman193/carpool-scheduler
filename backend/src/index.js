import { config } from './config.js'
import { createBackendServer } from './server.js'

const app = createBackendServer()

app.listen(config.port).then(() => {
  console.log(JSON.stringify({ level: 'info', msg: 'backend_started', port: config.port, apiPrefix: config.apiPrefix }))
})
