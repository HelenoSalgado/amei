import { Env } from "../../worker-configuration";
import { env } from "../config/env";

export function setProcessEnv(ev: Env){
  env.host = ev.API_HOST as string;
  env.DB = ev.DB;
  return;
}