import { WSModel }          from "../app/models/ws.model";

/**
 * Model for table found
 */
export class FoundEvolutionModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public years: Array<number> = [];
    public expenditures: Array<any> = [];

    public found_name: string;

    constructor( data?: any ) {
        super();
        this.found_name = data;
    }
}