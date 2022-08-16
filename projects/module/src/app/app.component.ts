import {Component} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {
    AlphaOracleService, ConcurrencySerialisationService, DropFile,
    FD_CONCURRENCY, FD_LOG, XesLogParserService
} from 'ilpn-components';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        {provide: APP_BASE_HREF, useValue: '/ilovepetrinets/wolf/'}
    ]
})
export class AppComponent {

    public FD_LOG = FD_LOG;
    public FD_CONCURRENCY = FD_CONCURRENCY;

    public fcParallelismDistance: FormControl;
    public fcDistinguishSameEvents: FormControl;

    public result: DropFile | undefined = undefined;
    public processing = false;

    constructor(private _xesParser: XesLogParserService, private _alphaOracle: AlphaOracleService, private _ConcurrencySerializer: ConcurrencySerialisationService) {
        this.fcParallelismDistance = new FormControl('1');
        this.fcDistinguishSameEvents = new FormControl(false);
    }

    processFileUpload(files: Array<DropFile>) {
        this.result = undefined;
        this.processing = true;
        const log = this._xesParser.parse(files[0].content);

        const concurrency = this._alphaOracle.determineConcurrency(log, {
            lookAheadDistance: this.fcParallelismDistance.value === '*' ? Number.POSITIVE_INFINITY : Number.parseInt(this.fcParallelismDistance.value),
            distinguishSameLabels: this.fcDistinguishSameEvents.value
        });

        this.result = new DropFile('concurrency.con', this._ConcurrencySerializer.serialise(concurrency));
        this.processing = false;
    }

}
