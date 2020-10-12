'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

// module.exports = merge(prodEnv, {
//   NODE_ENV: '"development"',
//   BASE_API: '"http://sx.water-mind.com:3408/sx_bim/"'
// })
module.exports = {
  NODE_ENV: '"development"',
  BASE_API: '"http://sx.water-mind.com:3408/sx_bim/"'
}
