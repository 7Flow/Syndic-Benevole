import { Injectable } from "@angular/core";
import { ConnectionBackend, Headers, Http, Response, ResponseOptions, Request, RequestMethod, RequestOptions, RequestOptionsArgs } from "@angular/http";

import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";


@Injectable()
export class HttpInterceptor extends Http {
    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        console.log("request...");

        return super.request(url, options);
        /*
        return super.request(url, options).catch( (res) => {
            // do something
        });
        */
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        console.log("get...");

        return super.request(url, options);
        /*
        return super.get(url, options).catch( (res) => {
            // do something
        });
        */
    }
}