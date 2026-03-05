import { prisma } from "../config/prisma";
import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";
import { NotFoundError } from "../utils";

export class CatalogRepository implements ICatalogRepository {

  async create(data: Product): Promise<Product> {
    return prisma.product.create({
      data,
    });
  }

  async update(data: Product): Promise<Product> {
    return prisma.product.update({
      where: { id: data.id },
      data,
    });
  }

  async delete(id: number) {
    return prisma.product.delete({
      where: { id },
    });
  }

  async find(): Promise<Product[]> {
    return prisma.product.findMany();
  }

  async findOne(id: number): Promise<Product> {
    const product = await prisma.product.findFirst({
      where: { id },
    });

    if (!product) {
      throw new NotFoundError("product not found");
    }

    return product;
  }

  findStock(ids: number[]): Promise<Product[]> {
    return prisma.product.findMany({
      where: {
        id: { in: ids },
      },
    });
  }
}