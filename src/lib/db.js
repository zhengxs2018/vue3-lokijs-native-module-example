import { LokiClient } from './loki.js'

const idbAdapter = new LokiIndexedAdapter('vue')

const db = new LokiClient('loki.db', {
  env: 'BROWSER',
  // 启用控制台输出
  verbose: true,
  // 自动加载
  // autoload: true,
  // 自动加载回调
  // autoloadCallback() {
  //   // pass
  // },
  // 自动保存
  autosave: true,
  // 保存之间的时间间隔
  autosaveInterval: 1500,
  // 适配器
  adapter: idbAdapter
})

export {
  idbAdapter
}

export default db
