import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Http, Response } from "@angular/http";
import { FormsModule }   from "@angular/forms";


import { RestService } from "../core/rest.service";
import { TranslateService } from "../translate/translate.service";

import { USER } from "../app/app.global";


@Component({
    selector: "section",
    template: '<div class="row align-center"><div class="column small-6"><div class="panel glass"><h1 class="title">{{\'welcome\' | translate}}</h1><div class="text">{{\'introduction\' | translate}}</div><a class="mail-to"></a></div></div><div class="column small-4"><div class="panel"><h2 class="title">{{\'connexion\' | translate}}</h2><form data-abide (ngSubmit)="onSubmit(authForm.value)" #authForm="ngForm"><div><input id="login" name="login" type="text" placeholder="{{\'login\' | translate}}" required pattern="[a-zA-Z0-9]+" ngModel></div><div><input id="password" name="password" type="password" placeholder="{{\'password\' | translate}}" required pattern="[a-zA-Z0-9]+" ngModel></div><div><button type="submit" class="button expanded" [disabled]="!authForm.form.valid">{{\'validate\' | translate}}</button></div></form></div></div></div>'
})

export class LoginComponent implements OnInit {

    // We inject the router via DI
    constructor( private router: Router, private service: RestService ) {
        // console.log("[LoginComponent]");
    }

    ngOnInit() {

    }

    onSubmit( form: any ) {
        this.service.SetAction("login");
        this.service.Post( form ).subscribe( (res: Response) => this.login(res) );
    }

    login( res: any ) {
        if (res.success === true) {
            for (let _prop in res.user) {
                USER[_prop] = res.user[_prop];
            }
            // DEFAULT REDIRECT TO HOME
            this.router.navigate(["/dashboard"]);
            // ELSE RETURN TO PREVIOUS PAGE

            // DISPATCH LOGIN TO APP.CONTROLLER
        }
    }
}