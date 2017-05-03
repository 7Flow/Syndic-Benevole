import { AbstractModel } from "../../core/models/abstract.model";
import { AuthorizationModel } from "./authorization.model";

/**
 * Each WS response is composed by:
 * - a data object
 * - an authorization object
 * So the WSModel is composed by 2 AbstractModel, one for data, one for auth.
 */
export class WSModel extends AbstractModel {

    /**
     * no initialization support
     */
    public authorization: AuthorizationModel = new AuthorizationModel();

    /**
     * calling super in ctor will break scope in fromJson (the internal set method scan class properties
     * (with super, the 'this' in set method will only have AbstractModel properties)
     * @param data
     */
    constructor( data?: any ) {
        super();
        if (data) {
            console.warn("[WSModel]: don't init this model with data. Call fromJson(data) manually");
        }
    }

    /**
     * Split data into an authorization model and this data model
     * @param json {object}
     */
    public fromJson( json: any ): void {
        if (!json.hasOwnProperty('data')) {
            console.error("[WSModel]: api should always respond by a json composed by an object 'data' and an object 'authorization'.");
        }

        if (json.data instanceof Array && json.data.length === 1) {
            console.warn("[WSModel]: response data is an Array of length 1. Object expected.");
            this.set( json.data[0] );
        } else {
            this.set( json.data );
        }

        if (json.authorization) {
            this.authorization.fromJson(json.authorization);
        }
    }

    /**
     * @return {object}
     */
    public toJson(): any {
        let _json: any = {};
        for (let _param in this) {
            if (_param !== "authorization") {
                _json[_param] = this[_param];
            }
        }
        return _json;
    }
}