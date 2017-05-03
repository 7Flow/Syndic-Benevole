import { Component, OnInit }            from "@angular/core";
import { Router, RouterModule, ActivatedRoute } from "@angular/router";

import { TranslateService }             from "../translate";
import { USER }                         from "../app/app.global";

@Component({
    selector: "main",
    templateUrl: "../../templates/app.html"
})

export class AppComponent implements OnInit {

    title = "ESyndic";

    constructor( private router: Router, private route: ActivatedRoute, private _translate: TranslateService ) {
        console.log("[AppComponent]");
    }

    ngOnInit() {
        // set current langage
        this.selectLang( navigator.language );
    }

    selectLang( lang: string ) {
        // set current lang;
        this._translate.use(lang);
    }
}