import {Injectable, Inject} from "@angular/core";

import { TRANSLATIONS } from "./translations";

@Injectable()
export class TranslateService {
    private _currentLang: string;

    public get currentLang() {
        return this._currentLang;
    }

    // inject our translations
    constructor(@Inject(TRANSLATIONS) private _translations: any) {

    }

    public use(lang: string): void {
        // set current language
        this._currentLang = lang;
    }

    public translate(key: string): string {
        if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
            return this._translations[this.currentLang][key];
        }

        return key;
    }

    public instant(key: string) {
        // call translation
        return this.translate(key);
    }
}