export class VentaDetalle{
    veDe_Id: number = 0;
    vent_Id: number = 0;
    comb_Id: number = 0;
    veDe_Cantidad: number = 0;
    veDe_Precio: number = 0;
    usua_Creacion: number = 0;
    veDe_FechaCreacion: Date = new Date();
    usua_Modificacion: number = 0; 
    veDe_FechaModificacion: Date = new Date();
    usuaC_Nombre: string = ""; 
    usuaM_Nombre: string = ""; 
    comb_Descripcion: string = ""; 
    codeStatus: number = 0;
    constructor(init?: Partial<VentaDetalle>) {
        Object.assign(this, init);
    } 
}