export class Combo{
    combo_Id: number = 0;
    combo_Descripcion: string = '';
    combo_Precio: number = 0;
    usua_Creacion: number = 0 ;
    combo_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    combo_FechaModificacion: Date = new Date() ;
    codeStatus: number = 0;

    constructor(init?: Partial<Combo>) {
        Object.assign(this, init);
    }

}