import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import {CabinetInterface} from './dataInterfaces/cabinet';
import {Adresse} from './dataInterfaces/adress';
import {sexeEnum} from './dataInterfaces/sexe';
import {PatientInterface} from './dataInterfaces/patient';
import {InfirmierInterface} from "./dataInterfaces/nurse";

@Injectable()
export class CabinetMedicalService {
  _http: any;
  private patient: PatientInterface;
  private InfirmierId: InfirmierInterface;

  constructor(private http: Http) {
  }

  getAdresseFrom(A: Element): Adresse {
    let node: Element;
    return {
      étage: (node = A.querySelector('étage')) ? node.textContent : '',
      rue: A.querySelector('rue').textContent,
      numéro: (node = A.querySelector('numéro')) ? node.textContent : '',
      ville: A.querySelector('ville').textContent,
      codePostal: parseInt(A.querySelector('étage') ? node.textContent : '', 10),
      lat: undefined,
      lng: undefined,

    };
  }

  getData(url: string): Promise<CabinetInterface> {

    return this.http.get(url).toPromise().then(res => {
      console.log(url, '=>', res);
      const text = res.text();

      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/xml');

      const cabinet: CabinetInterface = {
        infirmiers: [],
        patientsNonAffectés: [],
        adresse: this.getAdresseFrom(doc.querySelector('cabinet>adresse'))
      };
      //return cabinet
      console.log(cabinet);
      //les infirmiers
      const infirmiersXML: Element[] = Array.from(
        doc.querySelectorAll('infirmiers>infirmier')
      );

      cabinet.infirmiers = infirmiersXML.map(infirmiersXML => {
        return {
          id: infirmiersXML.getAttribute('id'),
          nom: (infirmiersXML.querySelector('nom')).textContent,
          prénom: (infirmiersXML.querySelector('prénom')).textContent,
          photo: (infirmiersXML.querySelector('photo')).textContent,
          patients: [],
          adresse: this.getAdresseFrom(infirmiersXML.querySelector('adresse'))
        };
      });

      const patientsXML = Array.from(
        doc.querySelectorAll('patients > patient')
      );
      const patients: PatientInterface[] = patientsXML.map(patientXML => {
        return {
          nom: patientXML.querySelector('nom').textContent,
          prénom: (patientXML.querySelector('prénom')).textContent,
          adresse: this.getAdresseFrom(patientXML.querySelector('adresse')),
          numéroSécuritéSociale: patientXML.querySelector('numéro').textContent,
          sexe: (patientXML.querySelector('sexe').textContent === 'M') ? sexeEnum.M : sexeEnum.F,
        };
      });

// calcul du tableau des affectations

      const affectation = patientsXML.map(patientXML => {
        const idP = patientXML.querySelector('numéro').textContent;
        const patient = patients.find(P => P.numéroSécuritéSociale === idP);
        const intervenant = patientXML.querySelector('visite').getAttribute('intervenant');
        const infirmier = cabinet.infirmiers.find(i => i.id === intervenant);

        return {infirmier: infirmier, patient: patient};
      });
      //puis réaliser les affectations

      affectation.forEach(A => {
          if (A.infirmier) {
            A.infirmier.patients.push(A.patient);
          } else {
            cabinet.patientsNonAffectés.push(A.patient);
          }
        }
      );

      console.log(patients);
      console.log(cabinet);
      return cabinet;
    });

  }

  Addpatient(nom, prenom , adresse , value, sexe, numeroSecuriteSociale ) {
    this._http.post('/addPatient', {
      patientName: this.patient.nom,
      patientForname: this.patient.prénom,
      patientNumber: this.patient.numéroSécuritéSociale,
      patientSex: this.patient.sexe === sexeEnum.M ? 'M' : 'F',
      patientBirthday: 'AAAA-MM-JJ',
      patientFloor: this.patient.adresse.étage,
      patientStreetNumber: this.patient.adresse.numéro,
      patientStreet: this.patient.adresse.rue,
      patientPostalCode: this.patient.adresse.codePostal,
      patientCity: this.patient.adresse.ville
    });
  }

  Afectation() {
    this._http.post('/affectation', {
      infirmier: this.InfirmierId,
      patient: this.patient.numéroSécuritéSociale
    });
  }
  Desaffecter(){
    this._http.post( '/affectation', {
      infirmier: 'none',
      patient : this.patient.numéroSécuritéSociale
  });

  }
}

