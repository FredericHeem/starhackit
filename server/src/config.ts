import { merge } from "lodash";
import { config as brokenConfig } from "node-config-ts";

const config = process.env.NODE_CONFIG
  ? merge(brokenConfig, JSON.parse(process.env.NODE_CONFIG))
  : brokenConfig;
export default config;
