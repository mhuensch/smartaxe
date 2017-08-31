const files = require.context('.', false, /\.js$/)
const modules = { $keys: [] }

files.keys().forEach(path => {
  if (path === './index.js') return

  let key = path.replace(/(\.\/|\.js)/g, '')
  modules[key] = files(path).default
  modules.$keys.push(key)
})

export default modules
