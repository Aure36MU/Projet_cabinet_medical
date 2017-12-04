import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {CabinetMedicalService} from "../cabinet-medical.service";
import {InfirmierInterface} from "../dataInterfaces/nurse";

@Component({
  selector: 'infirmier',
  templateUrl: './infirmier.component.html',
  styleUrls: ['./infirmier.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InfirmierComponent implements OnInit {
 @Input("data") infirmier: InfirmierInterface;

  constructor() {
  }

  ngOnInit() {
  }
}
