// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

import { IMqttServiceOptions } from "ngx-mqtt";

export const environment = {
  production: false,
  url:'http://127.0.0.1:3000'
};

export const MQTT_SERVICE_OPTIONS:IMqttServiceOptions={
  hostname:'localhost',
  port:8083,
  path:'/mqtt',
  protocol:'ws'
}
