export class Cliente{
    clie_Id: number = 0;
    clie_Identidad_Rtn: string = '';
    clie_Sexo: string = '';
    clie_Nombre: string = '';
    clie_Apellido: string = '';

    usua_Creacion: number = 0 ;
    clie_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    clie_FechaModificacion: Date = new Date() ;
    codeStatus: number = 0;

    constructor(init?: Partial<Cliente>) {
        Object.assign(this, init);
    }

}