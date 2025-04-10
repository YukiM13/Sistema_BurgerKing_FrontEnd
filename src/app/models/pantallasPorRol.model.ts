

export class PantallasPorRoles{
    pant_Id: number = 0;
    pant_Descripcion: string = '';

    constructor(init?: Partial<PantallasPorRoles>){
        Object.assign(this, init);

    }
}