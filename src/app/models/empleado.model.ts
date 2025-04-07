export class Empleados{
    empl_Id: number = 0;
    empl_Identidad: string = '';
    empl_Nombre: string = '';
    empl_Apellido: string = '';
    empl_FechaNacimiento: Date = new Date;
    empl_Sexo: string = '';
    esCi_Id: number = 0;
    esCi_Descripcion: string = '';
    carg_Id: number = 0;
    carg_Descripcion: string = '';
    sucu_Id: number = 0;
    sucu_Descripcion: string = '';
    usua_Creacion: number = 0;
    empl_FechaCreacion: Date = new Date;
    usua_Modificacion: number = 0;
    empl_FechaModificacion: Date = new Date;
    usuaC_Nombre: string = '';
    usuaM_Nombre: string = '';
    
    
    constructor(init?: Partial<Empleados>){
        Object.assign(this, init);

    }
}