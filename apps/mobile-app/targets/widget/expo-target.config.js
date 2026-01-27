/** @type {import('@bacons/apple-targets/app.plugin').ConfigFunction} */
module.exports = config => ({
  type: "widget",
  name: "BeanPositiveWidget",
  deploymentTarget: "17.0",
  bundleIdentifier: "com.beanpositive.app.widget",
  entitlements: {
    "com.apple.security.application-groups": ["group.com.beanpositive.app"]
  },
});