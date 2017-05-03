import { Injectable, Inject } from "@angular/core";
import { Http, Request, Headers, Response, RequestOptionsArgs, RequestOptions } from "@angular/http";
import { Router }       from "@angular/router";

import "rxjs/add/operator/map";
import { Observable }   from "rxjs/Observable";

import { CookieService } from "angular2-cookie/services/cookies.service";

import { Configuration } from "./config";

/**
 * RestService with auth token support
 * need to be in the providers of a top module (usually the main app module) with:
 * - imports: HttpModule
 * - providers: Configuration, CookieService
 */
@Injectable()
export class RestService {

    protected actionUrl: string;
    protected headers: Headers;

    protected token: string;

    constructor( private router: Router, protected _http: Http, protected config: Configuration, private _cookieService: CookieService ) {
        this.headers = new Headers();
        this.headers.append("Content-Type", "application/json");
        this.headers.append("Accept", "application/json");

        this.token = this._cookieService.get("esyndic-token");
    }

    /**
     * Set the url of the service.
     * For PUT or DELETE, this url must contains path params (like /id, etc...)
     */
    public SetAction( service: string ) {
        this.actionUrl = this.config.serverWithApiUrl + service;
    }

    public Get( options?: RequestOptionsArgs ): Observable<Response> {
        let opts: RequestOptionsArgs = this.build("get", this.actionUrl, options);
        return this.request(this.actionUrl, opts);
    }

    public Post( body: any, options?: RequestOptionsArgs ): Observable<Response> {
        let opts: RequestOptionsArgs = this.build("post", this.actionUrl, options, body);
        return this.request(this.actionUrl, opts);
    }


    public Put( body: any, options?: RequestOptionsArgs ): Observable<Response> {
        let opts: RequestOptionsArgs = this.build("put", this.actionUrl, options, body);
        return this.request(this.actionUrl, opts);
    }

    public Delete( options?: RequestOptionsArgs ): Observable<Response> {
        let opts: RequestOptionsArgs = this.build("delete", this.actionUrl, options);
        return this.request(this.actionUrl, opts);
    }


    /**
     *
     */
    private request( url: string | Request, options?: RequestOptionsArgs ): Observable<Response> {
        let req: Request;
        if (typeof url === "string") {
            let reqOpt = new RequestOptions(options);
            reqOpt.url = url;
            req = new Request(reqOpt);
        }
        else {
            req = url;
        }

        this.beforeRequest( req );

        return this._http.request(req)
                .catch( this.onError.bind(this) )
                .do( (res: Response) => { this.afterRequest(req, res); } )
                .map( (res: Response) => res.json() );
    }

    /**
     *  Before hook: inject auth token if set
     */
    private beforeRequest( req: Request ): void {
        if (this.token !== null) req.headers.set("Authorization", this.token);
    }

    private onError( res: Response ): Observable<Response> {
        if ( res.status === 401 || res.status === 403 ) {
            // redirect to login
            this.router.navigate(["/login"]);
        }
        return Observable.throw( res );
    }

    /**
     *  After request hook: intercept auth token in header
     */
    private afterRequest( req: Request, res: Response ) {
        if (res.status === 200) {
            // save auth token
            if (res.headers.get("authorization") !== undefined) {
                this.token = res.headers.get("authorization");
                this._cookieService.put("esyndic-token", this.token);
            }
        }
    }

    /**
     *  Build request
     */
    private build( method: string, url: string, options?: RequestOptionsArgs, body?: string ): RequestOptionsArgs {
        let aBody = body ? body : options && options.body ? options.body : undefined;

        let opts: RequestOptionsArgs = {
            method: method,
            url: url,
            headers: options && options.headers ? options.headers : this.headers,
            search: options && options.search ? options.search : undefined,
            body: aBody
        };
        return opts;
    }
}