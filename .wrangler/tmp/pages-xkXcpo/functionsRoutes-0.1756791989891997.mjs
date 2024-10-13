import { onRequestPost as __api_login_ts_onRequestPost } from "C:\\Users\\Admin\\Desktop\\MTracker\\Mtracker\\functions\\api\\login.ts"
import { onRequestPost as __api_register_ts_onRequestPost } from "C:\\Users\\Admin\\Desktop\\MTracker\\Mtracker\\functions\\api\\register.ts"

export const routes = [
    {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_ts_onRequestPost],
    },
  {
      routePath: "/api/register",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_register_ts_onRequestPost],
    },
  ]