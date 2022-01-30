require('dotenv').config()

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on: any, config: any) => {
  // Allow Cypress to see our Node environment variables via Cypress.env('some-variable')
  config.env = { ...process.env, ...config.env }
  return config
}
