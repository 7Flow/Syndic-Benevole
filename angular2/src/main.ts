// <reference path="../node_modules/typescript/lib/lib.es6.d.ts" />
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { enableProdMode } from "@angular/core";

import { AppModule } from "./app/app.module";

// if (process.env.ENV === "production") {
    enableProdMode();
// }

platformBrowserDynamic().bootstrapModule(
    AppModule
);

// platformBrowserDynamic().bootstrapModule(AppModule, [Configuration] );
// bootstrap( AppComponent, [ROUTER_PROVIDERS, HTTP_PROVIDERS, Configuration] );
