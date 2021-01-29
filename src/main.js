import { createApp } from 'https://esm.sh/vue@next'

import db from './lib/db.js'

import App from './App.js'

Promise.resolve(db.connect())
  .then(() => createApp(App))
  .then(app => app.mount('#app'))
