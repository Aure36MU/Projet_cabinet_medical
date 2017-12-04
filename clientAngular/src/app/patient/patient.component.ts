import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PatientInterface} from "../dataInterfaces/patient";

@Component({
  selector: 'patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PatientComponent implements OnInit {

  @Input("data") patient: PatientInterface;

  constructor() { }

  ngOnInit() {
  }

}
