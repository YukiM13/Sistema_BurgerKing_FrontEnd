

export class PantallasPorRoles{
    role_Id: number = 0;
    pant_Id: number = 0;
    usua_Creacion: number = 0;
    roPa_FechaCreacion: Date = new Date();
    usua_Modificacion: number = 0;
    roPa_FechaModificacion: Date = new Date();
    codeStatus: number = 0;
    

    constructor(init?: Partial<PantallasPorRoles>){
        Object.assign(this, init);

    }
}