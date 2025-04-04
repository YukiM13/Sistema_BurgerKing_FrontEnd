import { ObjectUnsubscribedError } from "rxjs";

export class Departamento{
    depa_Codigo: string = '';
    depa_Descripcion: string = '';
    usua_Creacion: number = 0 ;
    depa_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    depa_FechaModificacion: Date = new Date() ;


    constructor(init?: Partial<Departamento>) {
        Object.assign(this, init);

    }

}


      
