export default ({ app }) => {
  // Global Variables
  app.config.globalProperties.$serverUrl = process.env.SERVER_PROD_URL;
  app.config.globalProperties.$devUrl = process.env.DEV_PROD_URL;
};
