import { WSModel } from "../app/models/ws.model";

/**
 * Model for table found
 */
export class PlanningModel extends WSModel {
    // need to be initialized to be 'visible' by set method (which use hasOwnProperty)
    public planning_id: number = 0;
    public planning_name: string = "";
    public planning_year: number = 0;
    public planning_data: string = "";
    public planning_period: number = 0;
}