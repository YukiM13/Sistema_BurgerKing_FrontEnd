export class Sucursal{
    sucu_Id: number = 0;
    sucu_Descripcion: string = '';
    sucu_Direccion: string = '';
    muni_Codigo: string = '';
    muni_Descripcion: string = '';
    usua_Creacion: number = 0 ;
    sucu_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    sucu_FechaModificacion: Date = new Date() ;
    codeStatus: number = 0;


    constructor(init?: Partial<Sucursal>) {
        Object.assign(this, init);
    }

}