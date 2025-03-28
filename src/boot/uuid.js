import { v4 as uuidv4 } from "uuid";

export default ({ app }) => {
  // This makes the supabase client available in all components
  app.config.globalProperties.$supabase = uuidv4;
};

export { uuidv4 };
