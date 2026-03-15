import { ICatalogRepository } from "../interface/catalogRepository.interface";
import { OrderWithLineItems } from "../types/message.types";
import { MessageType, OrderEvent } from "../types/subscription.type";
import { AppEventListener } from "../utils/ElasticSearchContainer";

export class CatalogService {
  private _repository: ICatalogRepository;

  constructor(repository: ICatalogRepository) {
    this._repository = repository;
  }

  async createProduct(input: any) {
    const data = await this._repository.create(input);
    if (!data.id) {
      throw new Error("unable to create product");
    }
     AppEventListener.instance.notify({
      event: "createProduct",
      data: data
    });
    return data;
  }

  async updateProduct(input: any) {
    const data = await this._repository.update(input);
    if (!data.id) {
      throw new Error("unable to update product");
    }
    AppEventListener.instance.notify({
      event: "updateProduct",
      data: data
    });
    // emit event to update record in Elastic search
    return data;
  }

  // instead of this we will get product from Elastic search
  async getProducts(limit: number, offset: number) {
    const products = await this._repository.find(limit,offset);

    return products;
  }

  async getProduct(id: number) {
    const product = await this._repository.findOne(id);
    return product;
  }

  async deleteProduct(id: number) {
    const response = await this._repository.delete(id);
    // delete record from Elastic search
    AppEventListener.instance.notify({
      event: "updateProduct",
      data: {id}
    });
    return response;
  }

  async getProductStock(ids: number[]) {
    throw new Error("Unable");
    // const products = await this._repository.findStock(ids);
    // if (!products) {
    //     throw new Error("unable to find product stock details");
    // }
    // return products;
  }
  async handleBrokerMessage(message: any) {
    console.log("Catalog Service received message", message);
    const orderData = message.data as OrderWithLineItems;
    const { orderItems } = orderData;
    orderItems.forEach(async (item) => {
      console.log("Updating stock for product", item.productId, item.qty);
      const product = await this.getProduct(item.productId);
      if (!product) {
        console.log(
          "Product not found during stock update for create order",
          item.productId
        );
      } else {
        // update stock
        const updatedStock = product.stock - item.qty;
        await this.updateProduct({ ...product, stock: updatedStock });
      }

      // perform stock update operation
    });
    // perform action based
  }
}


export const HandleSubscription = async (message: MessageType) => {
  console.log("Catalog service received message:", message);
  // Handle order events, e.g., update stock when order is created
  if (message.event === OrderEvent.CREATE_ORDER) {
    // Reduce stock for ordered products
    // Implementation depends on the message data structure
  } else if (message.event === OrderEvent.CANCEL_ORDER) {
    // Restore stock for cancelled orders
  }
  
};