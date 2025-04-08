export class Municipios{
    muni_Codigo: string= '';
    muni_Descripcion: string= '';
    depa_Codigo: string= '';
    usua_Creacion: number= 0;
    muni_FechaCreacion: Date= new Date;
    usua_Modificacion: number = 0;
    muni_FechaModificacion: Date= new Date;
    usuaC_Nombre: string= '';
    usuaM_Nombre: string= '';
    depa_Descripcion: string= '';
    codeStatus: number = 0;
    constructor(init?: Partial<Municipios>){
        Object.assign(this, init);

    }
}