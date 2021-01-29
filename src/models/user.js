import { defineModel } from '../lib/loki.js'

export default defineModel('user', {
  // 创建索引
  indices: ['username'],
  // 定义唯一性字段
  unique: ['username', 'nickname']
})
