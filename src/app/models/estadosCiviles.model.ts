import { dA } from "@fullcalendar/core/internal-common";

export class EstadoCivil {
    esCi_Id : number =0 ;
    esci_Descripcion: string = '';
    usua_Creacion: number = 0;
    esCi_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0;
    esCi_FechaModificacion: Date = new Date();



    constructor(init?: Partial<EstadoCivil>){
        Object.assign(this, init);

    }
}