export class Productos {
    prod_Id: number = 0;
    prod_Descripcion: string = '';
    cate_Id: number = 0; 
    cate_Descripcion: string = '';
    usua_Creacion: number = 0;
    prod_FechaCreacion: Date = new Date();
    usua_Modificacion: number = 0;
    prod_FechaModificacion: Date = new Date();
    prod_Estado: boolean =true;
    prod_ImgUrl: string = '';
    usuaC_Nombre: string = '';
    usuaM_Nombre: string = '';
}