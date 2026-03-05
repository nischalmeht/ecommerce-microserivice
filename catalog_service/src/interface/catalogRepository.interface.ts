import { Product } from "../models/product.model";

export type ProductCreateInput = Omit<Product, 'id'>;
export type ProductUpdateInput = Required<Pick<Product, 'id'>> & Omit<Product, 'id'>;

export interface ICatalogRepository {
  create(data: ProductCreateInput): Promise<Product>;
  update(data: ProductUpdateInput): Promise<Product>;
  delete(id: number);
  find(limit: number, offset: number): Promise<Product[]>;
  findOne(id: number): Promise<Product>;
  findStock?(ids: number[]): Promise<Product[]>;
}
