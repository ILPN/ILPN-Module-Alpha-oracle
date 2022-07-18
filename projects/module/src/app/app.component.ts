import {Component} from '@angular/core';
import {APP_BASE_HREF} from '@angular/common';
import {FD_LOG, FD_PETRI_NET} from 'ilpn-components';
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

    constructor() {
        this.fcParallelismDistance = new FormControl('1');
        this.fcDistinguishSameEvents = new FormControl(false);
        this.fcAddStartStopEvent = new FormControl(false);
        this.fcMergeSamePrefix = new FormControl(false);
    }

}
