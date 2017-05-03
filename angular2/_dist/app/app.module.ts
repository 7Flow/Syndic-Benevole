import { NgModule }         from "@angular/core";
import { BrowserModule }    from "@angular/platform-browser";
import { HttpModule, Http } from "@angular/http";
import { CookieService }    from "angular2-cookie/services/cookies.service";


import { TranslateModule }  from "../translate";

import { AppComponent }     from "../app/app.component";

import { Configuration }    from "../core/config";
import { RestService }      from "../core/rest.service";

import { RoutingModule }    from "../routing/routing.module";

import { HeaderComponent }  from "../layout/header.component";
import { FooterComponent }  from "../layout/footer.component";
import { BreadcrumbComponent }  from "../routing/breadcrumb.component";


@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RoutingModule,
        TranslateModule
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        BreadcrumbComponent,
        FooterComponent
    ],
    providers: [
        Configuration,
        CookieService,
        RestService
    ],
    bootstrap: [
        AppComponent
    ]
})

export class AppModule {

    /*
    static forRoot() {
        return {
            ngModule: AppModule,
            declarations: [
                ConfirmComponent
            ],
            exports: [
                ConfirmComponent
            ]
        };
    };
    */
}
