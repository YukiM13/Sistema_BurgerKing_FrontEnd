export interface Respuesta<T> {
    code: number;
    success: boolean;
    message: string;
    data: T;
  }