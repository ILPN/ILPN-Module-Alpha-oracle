import {Component} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {
    AlphaOracleService, DropFile, FD_LOG, FD_PETRI_NET,
    IncrementingCounter, PetriNetSerialisationService, Relabeler, Trace, XesLogParserService
} from 'ilpn-components';
import {FormControl} from '@angular/forms';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [
        // TODO base href
        {provide: APP_BASE_HREF, useValue: '/ilovepetrinets/'}
    ]
})
export class AppComponent {

    public FD_LOG = FD_LOG;
    public FD_PN = FD_PETRI_NET;

    public fcParallelismDistance: FormControl;
    public fcDistinguishSameEvents: FormControl;
    public fcAddStartStopEvent: FormControl;
    public fcMergeSamePrefix: FormControl;

    public result: Array<DropFile> | undefined = undefined;
    public processing = false;

    constructor(private _xesParser: XesLogParserService, private _alphaOracle: AlphaOracleService, private _PetriNetSerializer: PetriNetSerialisationService) {
        this.fcParallelismDistance = new FormControl('1');
        this.fcDistinguishSameEvents = new FormControl(false);
        this.fcAddStartStopEvent = new FormControl(false);
        this.fcMergeSamePrefix = new FormControl(false);
    }

    processFileUpload(files: Array<DropFile>) {
        this.result = undefined;
        this.processing = true;
        const log = this._xesParser.parse(files[0].content);

        const relabeler = new Relabeler();
        if (this.fcDistinguishSameEvents.value) {
            this.relabelLog(log, relabeler);
        }

        this._alphaOracle.determineConcurrency(log, {
            addStartStopEvent: this.fcAddStartStopEvent.value,
            mergePrefixes: this.fcMergeSamePrefix.value,
            lookAheadDistance: this.fcParallelismDistance.value === '*' ? Number.POSITIVE_INFINITY : Number.parseInt(this.fcParallelismDistance.value)
        }).subscribe(pos => {
            const counter = new IncrementingCounter();
            this.result = pos.map(pn => {
                return new DropFile(`po${counter.next()}`, this._PetriNetSerializer.serialise(pn));
            });
        });
    }

    private relabelLog(log: Array<Trace>, relabeler: Relabeler) {
        for (const t of log) {
            for (const e of t.events) {
                e.name = relabeler.getNewLabel(e.name);
            }
            relabeler.restartSequence();
        }
    }

}
