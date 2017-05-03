import { ModuleWithProviders, NgModule } from "@angular/core";


import { TRANSLATION_PROVIDERS, TranslateService, TranslatePipe }   from "../translate";

@NgModule({
    declarations: [
        TranslatePipe
    ],
    providers: [
        TRANSLATION_PROVIDERS,
        TranslateService
    ],
    exports: [
        TranslatePipe
    ]
})

export class TranslateModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TranslateModule,
            providers: [
                TRANSLATION_PROVIDERS,
                TranslateService
            ]
        };
    };

};