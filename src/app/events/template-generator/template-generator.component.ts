import { Component, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import * as QRCode from 'qrcodejs2';

@Component({
    selector: 'sw-template-generator',
    templateUrl: './template-generator.component.html',
    styleUrls: ['./template-generator.component.scss']
})
export class TemplateGenerator implements OnInit {

    qrcode:any;
    isQRVisible = true;
    @ViewChild('myCanvas') myCanvas: ElementRef;
    @ViewChild('qrCode') image: ElementRef;
    @ViewChild('template') template: ElementRef;
    public context: CanvasRenderingContext2D;
    constructor( private cdr: ChangeDetectorRef) {}

    ngOnInit() {
        this.qrcode = new QRCode(this.image.nativeElement, {
            text: '',
            useSVG: false,
            heigth: 250,
            width: 250
        });
    }

    load(data: any) {
        this.qrcode.clear();
        this.qrcode.makeCode(data.text);
        setTimeout(() => {
            const context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
            const template = this.template.nativeElement;
            context.drawImage(template, 0, 0);
            const qr = this.image.nativeElement.querySelector('img');
            context.drawImage(qr, 130, 315, 260, 230);
            this.cdr.detectChanges();
            context.fillStyle = "white";
            context.font = '25px Arial';
            context.fillText(data.name, 150, 600);
            context.fillStyle = "white";
            context.font = 'bold 20px Arial'
            context.fillText(data.place, 195, 685);
            context.fillStyle = "gray";
            context.font = '18px Arial'
            context.fillText(data.address, 195, 705);
            context.fillStyle = "white";
            context.font = 'bold 22px Arial'
            context.fillText(data.hour, 63, 670);
            context.font = 'bold 65px Arial'
            context.fillText(data.day, 47, 740);
            context.font = 'bold 35px Arial'
            context.fillText(data.month, 45, 790);
            this.isQRVisible = false;
        }, 200);
    }

    print() {
        const context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');
        const url = context.canvas.toDataURL();
        const windows = window.open();
        windows.document.write("<img src='"+url+"'/>");
        setTimeout(() => {
            windows.print();
        }, 20);
    }
}