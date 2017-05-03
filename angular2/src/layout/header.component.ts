import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart, Event as NavigationEvent } from "@angular/router";


import { TranslateService }             from "../translate";
import { USER }                         from "../app/app.global";


@Component({
    selector: "header",
    templateUrl: "../../templates/layout/header.html"
})

export class HeaderComponent implements OnInit {

    constructor( private router: Router ) {
        console.log("[HeaderComponent]");
    }

    ngOnInit() {
        this.router.events.forEach((event: NavigationEvent) => {
            if (event instanceof NavigationStart) {
                console.log("on change");
            }
        });
    }

    // making global var accessible to templates
    get user() {
        return USER;
    }
}