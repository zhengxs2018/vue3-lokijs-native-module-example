import { defineComponent, h } from 'https://esm.sh/vue@next'

export default defineComponent({
  name: 'Table',
  props: {
    columns: {
      type: Array,
      default() {
        return []
      }
    },
    data: {
      type: Array,
      default() {
        return []
      }
    }
  },
  setup() {
    function getColValue(row, ctx) {
      const column = ctx.column
      const value = row[column.key]

      if (typeof column.formatter === 'function') {
        return column.formatter(row, ctx)
      }

      return value
    }

    return ({ data, columns }) => {
      return h('table', [
        h('thead', [
          h('tr', columns.map((column, i) => {
            return h('th', { key: i }, column.title)
          }))
        ]),
        h('tbody', data.map((row, rowIndex) => {
          return h('tr', columns.map((column, colIndex) => {
            return h('td', getColValue(row, { column, rowIndex, colIndex }))
          }))
        }))
      ])
    }
  }
})
