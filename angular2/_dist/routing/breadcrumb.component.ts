import { Component, OnInit }            from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";

import { TranslateService }             from "../translate/translate.service";

@Component({
    selector: "nav.breadcrumb",
    template: '<a *ngFor="let route of breadcrumbs" [routerLink]="route.url">{{route.label}}</a>'
})

/**
 *
 */
export class BreadcrumbComponent implements OnInit {

    public breadcrumbs: Array<any>;

    constructor( private router: Router, private route: ActivatedRoute, private _translate: TranslateService ) {
        console.log("[BreadcrumbComponent]");
    }

    ngOnInit() {
        // listen route change to update breadcrumb
        this.router.events
            .filter( event => event instanceof NavigationEnd )
            .subscribe( event => {
                this.breadcrumbs = [];
                let currentRoute = this.route.root,
                    _url = '';

                do {
                    let childrenRoutes = currentRoute.children;
                    currentRoute = null;
                    childrenRoutes.forEach( route => {
                        if (route.outlet === "primary") {
                            let _routeSnapshot = route.snapshot;
                            _url += "/" + _routeSnapshot.url.map( segment => segment.path ).join("/");

                            let _label = _routeSnapshot.data ?
                                this._translate.translate( _routeSnapshot.data["label"] )
                                : _routeSnapshot.url[_routeSnapshot.url.length-1].path;

                            this.breadcrumbs.push({
                                label: _label,
                                url:   _url
                            });

                            currentRoute = route;
                        }
                    })
                }
                while(currentRoute);
            })
    }
}