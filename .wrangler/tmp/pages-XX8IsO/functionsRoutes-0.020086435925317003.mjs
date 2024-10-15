import { onRequestPost as __api_login_ts_onRequestPost } from "C:\\Users\\Admin\\Desktop\\MTracker\\Mtracker\\functions\\api\\login.ts"
import { onRequestPost as __api_logout_ts_onRequestPost } from "C:\\Users\\Admin\\Desktop\\MTracker\\Mtracker\\functions\\api\\logout.ts"
import { onRequestPost as __api_register_ts_onRequestPost } from "C:\\Users\\Admin\\Desktop\\MTracker\\Mtracker\\functions\\api\\register.ts"
import { onRequestGet as __api_verify_ts_onRequestGet } from "C:\\Users\\Admin\\Desktop\\MTracker\\Mtracker\\functions\\api\\verify.ts"
import { onRequest as __api_checkin_ts_onRequest } from "C:\\Users\\Admin\\Desktop\\MTracker\\Mtracker\\functions\\api\\checkin.ts"

export const routes = [
    {
      routePath: "/api/login",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_login_ts_onRequestPost],
    },
  {
      routePath: "/api/logout",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_logout_ts_onRequestPost],
    },
  {
      routePath: "/api/register",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_register_ts_onRequestPost],
    },
  {
      routePath: "/api/verify",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_verify_ts_onRequestGet],
    },
  {
      routePath: "/api/checkin",
      mountPath: "/api",
      method: "",
      middlewares: [],
      modules: [__api_checkin_ts_onRequest],
    },
  ]