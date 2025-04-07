export  class Tamano{
    tama_Id: number = 0;
    tama_Descripcion: string = '';
    usua_Creacion: number = 0;
    tama_FechaCreacion: Date = new Date;
    usua_Modificacion: number = 0;
    tama_FechaModificacion: Date = new Date;
    usuaC_Nombre: string = ''; 
    usuaM_Nombre: string = '';
    constructor(init?: Partial<Tamano>){
        Object.assign(this, init);
    } 
}