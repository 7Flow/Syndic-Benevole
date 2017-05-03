import { Component, OnInit, Input, Output, EventEmitter, ElementRef } from "@angular/core";
import { Router, ActivatedRoute, Params }   from "@angular/router";
import { Http, Response }                   from "@angular/http";
import { FormsModule }                      from "@angular/forms";

import { CommonModule }                     from "@angular/common";


import { USER }                 from "../app/app.global";

import { PlanningStore }        from "./planning.store";
import { ApartmentStore }       from "../apartments/apartment.store";

// import { Planning }             from "./Planning";

import { TranslateService }     from "../translate/translate.service";


@Component({
    selector: "section",
    template: '<div class="row controls"><div class="large-12 columns"><div class="panel"><h2>{{\'planning\' | translate}}</h2><div id="labels" class="row labels" (click)="toggleFilters()"><div class="large-4 medium-4 small-4 columns"><label [attr.data-default]="\'apartments\' | translate">{{\'apartments\' | translate}}</label></div><div class="large-4 medium-4 small-4 columns period"><label [attr.data-default]="\'period\' | translate">{{\'period\' | translate}}</label></div><div class="large-4 medium-4 small-4 columns year"><label for="year" [attr.data-default]="\'year\' | translate">{{\'year\' | translate}}: {{year}}</label></div></div><div id="filters" class="row filters"><div class="large-4 medium-4 small-4 columns"><ul class="apartments"><li><input id="all" type="checkbox" checked value="all" class="all" [attr.data-label]="\'all\' | translate" (change)="updateApartments($event)"> <label for="all">{{\'all\' | translate}}</label></li><li *ngFor="let apart of apartmentStore.apartments; let i = index"><input id="apart{{apart.id}}" type="checkbox" value="{{i}}" class="lot" [attr.data-label]="apart.lot" (change)="updateApartments($event)"> <label for="apart{{apart.id}}">{{\'lot\' | translate}} {{apart.lot}} : {{apart.coowners}}</label></li></ul></div><div class="large-4 medium-4 small-4 columns period"><select class="period" (change)="updateFilters($event)"><option value="1">{{\'oneWeek\' | translate}}</option><option value="2" selected>{{\'twoWeeks\' | translate}}</option><option value="4">{{\'fourWeeks\' | translate}}</option></select></div><div class="large-4 medium-4 small-4 columns year"><input id="year" type="text" value="{{year}}"></div></div><div class="row actions"><div class="large-12 columns"><button class="button" (click)="create()">{{\'create\' | translate}}</button> <button class="button" (click)="save()">{{\'save\' | translate}}</button> <button class="button" (click)="load()">{{\'load\' | translate}}</button></div></div></div></div></div><div id="planning" class="row planning"><div class="large-12 columns"><div class="panel"><input type="textfield" class="title" value="Planning"></div></div></div>',
    providers: [
        ApartmentStore,
        PlanningStore
    ]
})

/**
 * Found component, to see evolution over years
 */
export class PlanningCreationComponent implements OnInit {

    private year: number = 2017;
    private months: Array<number> = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    private monthNames: Array<string> = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
    private period: number = 2;

    private couples: Array<Array<any>> = [];
    private selected: Array<any> = [];
    private highlight: number = 5;
    private highlighted: string = "";

    private opened: boolean = true;
    private filtersHeight: number = 0;

    // We inject the router via DI
    constructor( private router: Router,
                 private route: ActivatedRoute,
                 protected apartmentStore: ApartmentStore,
                 protected planningStore: PlanningStore,
                 protected translate: TranslateService,
                 private elementRef: ElementRef ) {
        // console.log("[PlanningComponent]");
    }

    ngOnInit(): void {
        this.year = new Date().getFullYear() + 1;

        this.apartmentStore.signal.subscribe( this.setFilters.bind(this) );
        this.planningStore.signal.subscribe( this.onComplete.bind(this) );

        this.apartmentStore.GET();
    }

    private toggleFilters(): void {
        console.log( "toggleFilters" );
        if (this.opened) {
            this.opened = false;
            $("#filters").height(0);
        } else {
            this.opened = true;
            $("#filters").height( this.filtersHeight );
        }
    }

    private setFilters(): void {
        setTimeout( () => {
            this.filtersHeight = $("#filters").height();
            this.toggleFilters();
            this.updateFilters();
        }, 0);
    }

    private updateApartments( event: any ): void {
        let _value: string = event.target.value;
        let _check: boolean = $( event.target ).prop("checked");

        if (_check) {
            if (_value === "all") {
                $("#filters").find("input.lot").prop("checked", false);
            } else {
                $("#filters").find("input.all").prop("checked", false);
            }
        }
        this.updateFilters();
    }

    private updateFilters( event?: any ): void {
        this.year = $("#year").val();

        this.period = $("select.period").val();
        // apartments
        this.selected = [];
        $("#filters").find(".apartments").find("input:checked").each( (index: number, element: any) => {
            let _val: string = $(element).val();
            if (_val === "all") {
                this.selected = $("#filters").find(".apartments").find("input:checkbox").slice(1).map( (index: number, element: any) => {
                    return parseInt( $(element).val() );
                }).get();
            } else {
                this.selected.push( _val );
            }
        });

        this.updateFiltersLabels();
    }

    private updateFiltersLabels(): void {
        let _text: string = "";

        // APARTMENTS
        let _label: any = $("#labels").find(".columns:first").find("label:first");

        let _selected: any = $("#filters").find(".apartments").find("input:checked").map( (index: number, element: any) => {
            return $(element).data("label");
        }).get();
        _label.text( _label.data("default") + " : " + _selected.join("-") );

        // PERIOD
        this.planningStore.model.planning_period = parseInt( $("#filters").find(".columns.period select").val() );

        _label = $("#labels").find(".columns.period").find("label:first");
        _label.text( _label.data("default") + " : " + this.planningStore.model.planning_period );


        // YEAR
        this.planningStore.model.planning_year = parseInt( $("#filters").find(".columns.year input").val() );

        _label = $("#labels").find(".columns.year").find("label:first");
        _label.text( _label.data("default") + " : " + this.planningStore.model.planning_year );
    }

    private createCouples(): void {
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

        this.planningStore.model.planning_data = JSON.stringify( this.couples );
    }

    private createMonths(): string {
        let i, j, k, _l, d,
            _tpl: string = "<table class=\"each-" + this.period + "\">",
            dayName: Array<string> = ["D", "L", "M", "M", "J", "V", "S"],
            dayOrder: Array<number> = [1, 2, 3, 4, 5, 6, 0],
            firstMonth: number = this.months[0],
            lastMonth: number = firstMonth + this.months.length;

        _tpl += "<thead><tr> <th></th>";
        for (i in dayOrder) {
            _tpl += "<th>" + dayName[dayOrder[i]] + "</th>";
        }
        _tpl += "<th>" + this.translate.translate("responsable") + "</th> <th>" + this.translate.translate("spare") + "</th>";
        _tpl += "</tr></thead>";

        _tpl += "<tbody>";

        let periodClass: string = "period-odd",
            monthClass: string = "month-odd",
            // - current association responsable-spare
            currentCouple: number = 0,
            // - current set of couples
            currentCouples: number = 0,
            currentCoupleLength: number = 0,
            _couplesInverted: boolean = false,
            _monthWeekNum: number = 0,
            _coowners: string = "";

        let _line: string = "<tr class=\"" + periodClass + " " + monthClass,
            _lineTDs: string = "<td class=\"name\"></td>";

        for (i = firstMonth; i < lastMonth; ++i) {
            d = new Date(this.year, this.months[i], 1);
            _monthWeekNum = 0;

            // IF FIRST MONTH
            // -> display empty cells
            if (i === firstMonth) {
                for (j = 0, _l = dayOrder.indexOf(d.getDay()); j < _l; ++j) {
                    _lineTDs += "<td class=\"blank\"> </td>";
                }
            }

            // mont last day: get first day of next month
            d.setMonth(this.months[i] + 1, 0);
            // fill with month"s dates
            for (k = 1; k <= d.getDate(); ++k) {
                ++j;
                if (j > 7) {
                    j = 1;
                    // add couples
                    if (_couplesInverted) {
                        _coowners = this.couples[currentCouples][currentCouple][1];
                        _lineTDs += "<td class=\"coowner " + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                        _coowners = this.couples[currentCouples][currentCouple][0];
                        _lineTDs += "<td class=\"coowner "  + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                    }
                    else {
                        _coowners = this.couples[currentCouples][currentCouple][0];
                        _lineTDs += "<td class=\"coowner " + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                        _coowners = this.couples[currentCouples][currentCouple][1];
                        _lineTDs += "<td class=\"coowner "  + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                    }
                    // update couple cycle
                    ++currentCoupleLength;
                    if (currentCoupleLength >= this.period) {
                        // new period
                        if (periodClass === "period-odd") periodClass = "period-even";
                        else periodClass = "period-odd";

                        _lineTDs += "</tr><tr class=\"blank " + monthClass + "\"><td class=\"name\"></td> <td colspan=\"9\"></td>";

                        currentCoupleLength = 0;
                        ++currentCouple;
                        if (currentCouple >= this.couples[currentCouples].length) {
                            // second pass: invert couple
                            if (!_couplesInverted) {
                                _couplesInverted = true;
                                currentCouple = 0;
                            }
                            // or creates new couples association
                            else {
                                this.createCouples();
                                _couplesInverted = false;
                                currentCouple = 0;
                                ++currentCouples;
                            }
                        }
                    }
                    // close line
                    ++_monthWeekNum;
                    _line +=  "\">" + _lineTDs + "</tr>";
                    _tpl += _line;

                    // init new line
                    _line = "<tr class=\"" + periodClass + " " + monthClass;
                    _lineTDs = "<td class=\"name\">";
                    if (_monthWeekNum > 1) {
                        _monthWeekNum = -10;
                        _lineTDs += "<span>" + this.monthNames[i] + "</span>";
                    }
                    _lineTDs += "</td>";
                }
                _lineTDs += "<td class=\"" + monthClass + "\">" + k + "</td>";
            }

            // NEW MONTH
            if (monthClass === "month-odd") monthClass = "month-even";
            else monthClass = "month-odd";

            // 2 MONTHS ON THE SAME WEEK
            // (if its not the last day of the month on the last day of the week)
            if (k < d.getDate() || j < 7) {
                _line += "-" + monthClass;
            }

            // IF LAST MONTH
            // -> fill last lines with empty cells
            if (i === lastMonth - 1) {
                for (j; j < 7; ++j) {
                    _lineTDs += "<td class=\"blank\"> </td>";
                }
                // last week
                // -> add couples
                if (_couplesInverted) {
                    _coowners = this.couples[currentCouples][currentCouple][1];
                    _lineTDs += "<td class=\"coowner " + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                    _coowners = this.couples[currentCouples][currentCouple][0];
                    _lineTDs += "<td class=\"coowner "  + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                }
                else {
                    _coowners = this.couples[currentCouples][currentCouple][0];
                    _lineTDs += "<td class=\"coowner " + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                    _coowners = this.couples[currentCouples][currentCouple][1];
                    _lineTDs += "<td class=\"coowner "  + (_coowners === this.highlighted ? "highlight" : "") + "\">" + _coowners + "</td>";
                }
                // end planning
                _line += "\">" + _lineTDs + "</tr>";
                _tpl += _line;
            }
        }

        _tpl += "</tbody></table>";
        return _tpl;
    }

    public create(): void {
        this.updateFilters();

        // set model
        this.couples = [];
        this.createCouples();
        this.planningStore.model.planning_name = $("#planning input.title").val();

        this.generate();
    }

    public generate(): void {
        this.highlighted = this.apartmentStore.apartments[ this.highlight ].coowners;

        let _tpl: string = this.createMonths();

        let _$el = $( this.elementRef.nativeElement );
        if ( _$el.find(".planning table").length > 0 ) _$el.find(".planning table").remove();

        _$el.find(".planning > .columns > .panel").append( _tpl );
    }

    public save(): void {
        this.planningStore.POST();
    }

    public load(): void {
        this.planningStore.GET( {value: {
            id: 2
        }});
    }

    public onComplete( res: any ): void {
        this.couples = JSON.parse( this.planningStore.model.planning_data );
        this.generate();
    }
}