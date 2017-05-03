import { WSModel } from "../app/models/ws.model";
import { FoundModel } from "../founds/found.model";

/**
 * Model for table budget
 */
export class BudgetModel extends WSModel {

    public budget_id: number;
    public budget_year: number;

    public founds: Array<FoundModel> = [];

    public fromJson( json: any ): void {
        console.log("fromJson");
        super.fromJson( json );

        if (json.data.length) {
            for (let i = 0, l = json.data.length; i < l; ++i) {
                // WSModel couldn't be built directly from ctor
                let _found = new FoundModel();
                _found.fromJson( json.data[i] );
                this.founds.push(_found);
            }
            this.budget_id = json.data[0].data.budget_id;
            this.budget_year = json.data[0].data.budget_year;
        }
    }
}