export class Venta{
    vent_Id: number = 0;
    vent_Fecha: Date = new Date();
    clie_Id: number = 0;
    sucu_Id: number = 0;
    clie_NombreC: string = '';
    sucu_Descripcion: string = '';

    usua_Creacion: number = 0 ;
    vent_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    vent_FechaModificacion: Date = new Date() ;
    codeStatus: number = 0;


    constructor(init?: Partial<Venta>) {
        Object.assign(this, init);
    }

}