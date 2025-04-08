export class Categoria{
    cate_Id: number = 0;
    cate_Descripcion: string = '';
    usua_Creacion: number = 0 ;
    cate_FechaCreacion: Date = new Date() ;
    usua_Modificacion: number = 0 ;
    cate_FechaModificacion: Date = new Date() ;
    codeStatus: number = 0;

    constructor(init?: Partial<Categoria>) {
        Object.assign(this, init);
    }

}