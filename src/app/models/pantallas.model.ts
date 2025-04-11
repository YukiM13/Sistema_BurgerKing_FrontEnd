export class Pantallas{
   pant_Id: number = 0;
   pant_Descripcion: string = '';
   codeStatus: number = 0;


    constructor(init?: Partial<Pantallas>){
        Object.assign(this, init);

    }
}