
export class AppComponent {

    constructor() {

    }

    private createCouples( selected: Array<any> ): Array<any> {
        console.trace( "::createCouples" );
        // create coowners couple
        let _remains: number = this.selected.length,
            _unselected: Array<number> = this.selected.concat(),
            _couplesNames: Array<Array<string>> = [];

        for (let i = 0, _l = Math.ceil(_remains * 0.5); i < _l; ++i) {
            // take 2 random apartment to makes a couple "primary / alternate"
            let _random = Math.random() * (_remains--);
            let _couple: Array<any> = [ _unselected.splice( Math.floor(_random), 1) ];

            _random = Math.random() * (_remains--);
            _couple.push( _unselected.splice( Math.floor(_random), 1) );

            _couplesNames.push( [
                this.apartmentStore.apartments[ _couple[0] ].coowners,
                this.apartmentStore.apartments[ _couple[1] ].coowners
            ] );
        }

        this.couples.push( _couplesNames );
        return this.couples;
    }

    public generate(): void {

    }
}