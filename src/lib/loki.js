const readyCallbacks = []

export class LokiClient extends loki {
  constructor(filename, options) {
    super(filename, options)

    this.__readyPromise__ = new Promise((resolve, reject) => {
      this.__readyResolve__ = resolve
      this.__readyReject__ = reject
    })
  }

  connect(options = {}) {
    if (LokiClient.__ready__) {
      return this.__readyPromise__
    }

    return new Promise((resolve, reject) => {
      this.loadDatabase(options, (err) => {
        if (err) {
          return reject(err)
        }

        LokiClient.__ready__ = true
        LokiClient.instance = this

        readyCallbacks.forEach(cb => cb(this))

        resolve()
        this.__readyResolve__()
      })
    })
  }

  ready(callback) {
    if (typeof callback === 'function') {
      this.__readyPromise__.then(callback)
    }
    return this.__readyPromise__
  }
}

/**
 * 定义模型
 *
 * @param {String} name
 * @param {Object} options
 */
export function defineModel(name, options) {
  const connection = {
    create(data) {
      const conn = connection.conn
      return connection.save(conn.insert(data))
    },
    save(data) {
      const db = connection.db
      return new Promise((resolve, reject) => {
        db.saveDatabase((err) => {
          if (err) reject(err)
          else resolve(data)
        })
      })
    }
  }

  function connect(db) {
    connection.db = db
    connection.conn = db.getCollection(name) || db.addCollection(name, options)
  }

  if (LokiClient.__ready__) {
    connect(LokiClient.instance)
  } else {
    readyCallbacks.push(connect)
  }

  return new Proxy(connection, {
    get(target, propName) {
      const conn = target.conn
      if (conn) {
        return target[propName] || conn[propName]
      }

      throw new Error('请先调用 LokiClient#connect 方法')
    }
  })
}
