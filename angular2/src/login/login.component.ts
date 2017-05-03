import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Http, Response } from "@angular/http";
import { FormsModule }   from "@angular/forms";


import { RestService } from "../core/rest.service";
import { TranslateService } from "../translate/translate.service";

import { USER } from "../app/app.global";


@Component({
    selector: "section",
    templateUrl: "../../templates/login/home.html"
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