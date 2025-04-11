export class ComboDetalle{
    coDe_Id: number = 0;
  prTa_Id: number = 0;
  comb_Id: number = 0;
  usua_Creacion: number = 0;
  coDe_FechaCreacion: Date = new Date();
  usua_Modificacion: number = 0;
  coDe_FechaModificacion: Date = new Date();
  coDe_Cantidad: number = 0;
  codeStatus: number = 0;
  constructor(init?: Partial<ComboDetalle>) {
    Object.assign(this, init);
}
}