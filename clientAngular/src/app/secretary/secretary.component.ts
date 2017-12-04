import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {CabinetMedicalService} from '../cabinet-medical.service';
import {InfirmierInterface} from '../dataInterfaces/nurse';
import {CabinetInterface} from '../dataInterfaces/cabinet';
import {PatientInterface} from '../dataInterfaces/patient';
import {sexeEnum} from '../dataInterfaces/sexe';

@Component({
  selector: 'app-secretary',
  templateUrl: './secretary.component.html',
  styleUrls: ['./secretary.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SecretaryComponent implements OnInit {
  _http: any;
  private cabinet: CabinetInterface;
  private patient: PatientInterface;
  constructor(private cs: CabinetMedicalService) {
    cs.getData('/data/cabinetInfirmier.xml').then(cabinet => this.cabinet = cabinet);

  }
  getinfirmiers(): InfirmierInterface[]{
    return this.cabinet ? this.cabinet.infirmiers : [];
  }

  ngOnInit() {
  }


}
