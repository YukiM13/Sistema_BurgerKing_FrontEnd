export class ProductoPorTamano {
    prod_Id: number = 0;
    tama_Id: number = 0;
    tama_Descripcion: string = '';
    prTa_Precio: number = 0;
    prTa_FechaCreacion: Date = new Date();
    usua_Creacion: number = 0;
    usua_Modificacion: number = 0;
    prTa_FechaModificacion: Date = new Date();
    cate_Descripcion: string = '';
    codeStatus: number = 0;
    constructor(init?: Partial<ProductoPorTamano>) {
        Object.assign(this, init);
    }
}