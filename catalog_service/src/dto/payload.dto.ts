import { CreateProductRequest } from "./product.dto";

export type CatalogPayload = {id:number} & Partial<CreateProductRequest>