const files = require.context('.', false, /\.vue$/)
const modules = { $keys: [] }

files.keys().forEach(path => {
  let key = path.replace(/(\.\/|\.vue)/g, '')
  modules[key] = files(path)
  modules.$keys.push(key)
})

export default modules
