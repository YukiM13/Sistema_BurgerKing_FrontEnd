export class Roles{
    role_Id: number = 0;
    role_Descripcion: string = '';
    usua_Creacion: number = 0;
    role_FechaCreacion: Date = new Date;
    usua_Modificacion: number = 0;
    role_FechaModificacion: Date = new Date;
    role_Estado: boolean = true;
    pant_Id: number = 0;
    pant_Descripcion: string = '';
    usuaC_Nombre: string = '';
    usuaM_Nombre: string = '';


    codeStatus: number = 0;
    constructor(init?: Partial<Roles>){
        Object.assign(this, init);

    }
}