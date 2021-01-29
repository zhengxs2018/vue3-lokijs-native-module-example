import _ from 'https://esm.sh/lodash-es'

import { defineComponent, h, reactive, onBeforeMount, toRaw } from 'https://esm.sh/vue@next'

import User from './models/user.js'

import { useDBCollections } from './hooks/useDBCollections.js'

import Table from './components/Table.js'

const initialState  = () => ({
  username: '',
  nickname: '',
  password: ''
})

export default defineComponent({
  name: 'App',
  setup() {
    const collections = useDBCollections()

    const formData = reactive(initialState())

    const tableData = reactive({
      name: null,
      columns: [
        {
          title: '用户名',
          key: 'username'
        },
        {
          title: '昵称',
          key: 'nickname'
        }
      ],
      data: []
    })

    async function handleAddUser() {
      await User.create(_.cloneDeep(formData))

      Object.assign(formData, initialState())
      collections.refresh()

      if (!tableData.name || tableData.name === 'user') {
        handleCollectionClick('user')
      }
    }

    function handleCollectionClick(modelName) {
      switch (modelName) {
        case 'user':
          if (tableData.name !== modelName) {
            tableData.name = modelName
            tableData.columns = [
              {
                title: '用户名',
                key: 'username'
              },
              {
                title: '昵称',
                key: 'nickname'
              }
            ]
          }
          tableData.data = User.find()
          break
      }
    }

    onBeforeMount(() => {
      const first = _.head(collections.data)
      if (first) {
        handleCollectionClick(first.name)
      }
    })

    return () => {
      return [
        h('h3', '操作'),
        h('form', [
          h('div', h('label', [
            '用户名',
            h('input', {
              value: formData.username,
              placeholder: '请输入用户名',
              onInput(event) {
                formData.username = event.target.value.trim()
              }
            })
          ])),
          h('div', h('label', [
            '昵称',
            h('input', {
              value: formData.nickname,
              placeholder: '请输入昵称',
              onInput(event) {
                formData.nickname = event.target.value.trim()
              }
            })
          ])),
          h('div', h('label', [
            '密码',
            h('input', {
              value: formData.password,
              type: 'password',
              placeholder: '请输入密码',
              onInput(event) {
                formData.password = event.target.value.trim()
              }
            })
          ]))
        ]),
        h('button', { onClick: handleAddUser }, [
          '添加用户'
        ]),
        h('h3', '表'),
        h('ul', collections.data.map((item, i) => {
          const attrs = {
            onClick: () => handleCollectionClick(item.name),
            key: i
          }
          return h('li', attrs, `${item.name}(${item.count})`)
        })),
        h('h3', '表数据'),
        h(Table, {
          columns: tableData.columns,
          data: tableData.data
        })
      ]
    }
  }
})
