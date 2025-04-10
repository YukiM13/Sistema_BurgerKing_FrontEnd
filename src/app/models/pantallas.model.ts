export class Pantallas{
   pant_Id: number = 0;
   pant_Descripcion: string = '';



    constructor(init?: Partial<Pantallas>){
        Object.assign(this, init);

    }
}