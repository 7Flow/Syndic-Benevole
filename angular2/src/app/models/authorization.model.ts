import { AbstractModel } from "../../core/models/abstract.model";

export class AuthorizationModel extends AbstractModel {
    // by default: no access
    public GET: boolean = false;
    public PUT: boolean = false;
    public POST: boolean = false;
    public DELETE: boolean = false;

}