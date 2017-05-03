import { Injectable, EventEmitter, Output } from "@angular/core";
import { Response }                 from "@angular/http";

import { Subject, Observable }      from 'rxjs';


// RestService must be global (provider of the top-level module)
import { RestService }              from "../rest.service";

import { AbstractModel }            from "./abstract.model";

/**
 *
 * As Store will be injected, it can't extends EventEmitter. So we must have this 'signal' extra object to subscribe to.
 */
@Injectable()
export class AbstractStore {

    public name: string = "service";

    public model: AbstractModel | any;

    public signal: EventEmitter<any>;

    private stream = new Subject<boolean>();
    @Output() observable = this.stream.asObservable();

    /**
     *
     * @param data {object} API response json, compound by 2 object: authorization & data
     */
    constructor( protected service: RestService ) {
        this.signal = new EventEmitter<any>();
    }

    public GET( routeParams?: any ): void {
        if (routeParams) {
            this.service.SetAction( this.name + "/" + routeParams.value.id );
        } else {
            this.service.SetAction( this.name );
        }
        this.service.Get().subscribe( this.mapToModel.bind(this) );
    }

    public POST(): void {
        this.service.SetAction( this.name );
        this.service.Post( this.model.toJson() ).subscribe( this.onComplete.bind(this) );
    }

    public PUT( routeParams: any ): void {
        this.service.SetAction( this.name + "/" + routeParams.value.id );
        this.service.Put( this.model.toJson() ).subscribe( this.onComplete.bind(this) );
    }

    public DELETE( routeParams: any ): void {
        this.service.SetAction( this.name + "/" + routeParams.value.id );
        this.service.Delete().subscribe( this.onComplete.bind(this) );
    }

    public mapToModel( json: any ): void {
        this.model.fromJson( json );
        this.signal.emit( json );
        this.stream.next( json );
    }

    public onComplete( json: any ): void {
        console.log( json );
        this.stream.next( json );
    }
}