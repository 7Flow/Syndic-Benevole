
export class AbstractModel {

    /**
     *
     * @param data
     */
    constructor( data?: any ) {
        if (data) {
            this.fromJson( data );
        }
    }

    protected get(): any {
        return {};
    }

    /**
     * Set model's properties according to json (json and this structure must be the same).
     * If a param in the json is not found on the Model, it will not be added to the model.
     * (the model describe what we want from the data)
     * @param json
     */
    protected set( json: any ): void {
        for (let _param in json) {
            if (this.hasOwnProperty(_param)) {
                this[_param] = json[_param];
            } else {
                // console.warn("[AbstractModel]:missing param " + _param);
            }
        }
    }

    /**
     * Populate model data from a json object.
     * Should be overrided for complex model, or to add data processing
     * @param json {object}
     */
    public fromJson( json: any ): void {
        // set will parse 'this' properties, so it must be scope (Typescript inheritance breaks child properties)
        this.set( json );
    }

    /**
     * @return {object}
     */
    public toJson(): string {
        let _json: any = {};
        for (let _param in this) {
            _json[_param] = this[_param];
        }
        return _json;
    }

    /**
     * Return this object as a string (not json).
     * Use for debug only.
     * @returns {string}
     */
    public toString(): string {
        return "[AbstractModel]";
    }
}