export class Cargo{
    carg_Id: number = 0;
    carg_Descripcion: string = '';
    usua_Creacion: number = 0 ;
    carg_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    carg_FechaModificacion: Date = new Date() ;


    constructor(init?: Partial<Cargo>) {
        Object.assign(this, init);
    }

}