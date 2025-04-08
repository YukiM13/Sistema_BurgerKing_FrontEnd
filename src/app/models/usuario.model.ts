import { dA } from "@fullcalendar/core/internal-common";

export class Usuario{
    usua_Id: number = 0;
    usua_Usuario: string = '';
    usua_Clave: string = '';
    usua_Correo: string = '';
    empl_Id: number = 0;
    role_Id: number = 0;
    usua_Creacion: number = 0;
    usua_FechaCreacion: Date = new Date;
    usua_Modificacion: number = 0;
    usua_FechaModificacion: Date = new Date;
    usua_Estado: boolean = true;
    usua_Admin: boolean = false;
    usua_CodigoRestablecer: string = '';
    usuaC_Nombre: string='';
    usuaM_Nombre: string='';
    nombreEmpleado: string ='';

    codeStatus: number = 0;

    constructor(init?: Partial<Usuario>){
        Object.assign(this, init);

    }
}