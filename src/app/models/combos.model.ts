export class Combo{
    comb_Id: number = 0;
    comb_Descripcion: string = '';
    comb_Precio: number = 0;
    usua_Creacion: number = 0 ;
    comb_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    comb_FechaModificacion: Date = new Date() ;
    codeStatus: number = 0;

    constructor(init?: Partial<Combo>) {
        Object.assign(this, init);
    }

}