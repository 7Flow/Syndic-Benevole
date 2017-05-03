import { Component, OnInit } from "@angular/core";
import { Router, NavigationStart, Event as NavigationEvent } from "@angular/router";


import { TranslateService }             from "../translate";
import { USER }                         from "../app/app.global";


@Component({
    selector: "header",
    template: '<h1>{{\'title\' | translate}}</h1><nav><ul class="menu align-right"><li *ngIf="user.id"><a routerLink="/dashboard" class="button light icon-adjustments"><span hidden>{{\'dashboard\' | translate}}</span></a> <a routerLink="/planning" class="button light icon-calendar"><span hidden>{{\'planning\' | translate}}</span></a> <a routerLink="/documents" class="button light icon-document"><span hidden>{{\'documents\' | translate}}</span></a></li><li *ngIf="!user.id"><a routerLink="/login">{{\'login\' | translate}}</a></li><li *ngIf="user.id"><a routerLink="/account" class="button light icon-profile"><span hidden>{{\'account\' | translate}}</span></a></li></ul></nav>'
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