// import { EventPayload } from "../utils/ElasticSearchContainer";
// export class ElasticSearchService {
// private indexName = "product";
// constructor() {}
// async handleEvents({ event, data }: EventPayload) {
// console.log("ElasticSearchService: handleEvents", event, data);
// switch (event) {
// case "createProduct":
//  console.log("Create product event received in ElasticSearchService");
// return;
// case "updateProduct":
// console.log("Update product event received in ElasticSearchService");
// return;
// case "deleteProduct":
// console.log("Delete product event received in ElasticSearchService");
// }
// }
// }

import th from "@faker-js/faker/locales/th";
import { EventPayload } from "../utils/ElasticSearchContainer";
import { Client } from '@elastic/elasticsearch';

export class ElasticSearchService {
    private indexName = "product";
    private client: Client;
    constructor() {
        this.client = new Client({ node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200' });
        this.createIndex();
    }

    async handleEvents({ event, data }: EventPayload) {
        console.log("ElasticSearchService: handleEvents", event, data);

        switch (event) {

            case "createProduct":
                await this.createProduct(data);
                console.log("Create product event received");
                return;

            case "updateProduct":
                await this.updateProduct(data)
                console.log("Update product event received");
                return;

            case "deleteProduct":
                // await this.deleteProduct(data);
                console.log("Delete product event received");
                return;
        }
    }


//     async createIndex() {
//         const indexExists = await this.client.indices.exists({ index: this.indexName });
//        if (!indexExists) {
//   await this.client.indices.create({
//     index: this.indexName,
//     body: {
//       mappings: {
//         properties: {
//           id: {
//             type: "keyword"
//           },
//           name: {
//             type: "text"
//           },
//           description: {
//             type: "text"
//           },
//           price: {
//             type: "float"
//           },
//           category: {
//             type: "keyword"
//           },
//           stock: {
//             type: "integer"
//           },
//           createdAt: {
//             type: "date"
//           }
//         }
//       }
//     }
//   });

//   console.log("Product index created");
// }
//     }
async createIndex() {
  const indexExists = await this.client.indices.exists({
    index: this.indexName
  });

  if (!indexExists) {
    await this.client.indices.create({
      index: this.indexName,
      mappings: {
        properties: {
          id: { type: "keyword" },
          name: { type: "text" },
          description: { type: "text" },
          price: { type: "float" },
          category: { type: "keyword" },
          stock: { type: "integer" },
          createdAt: { type: "date" }
        }
      }
    });

    console.log("Index created");
  }
}
async getProductById(id: string) {
  try {
    const result = await this.client.get({
      index: this.indexName,
      id: id
    });

    return result._source;
  } catch (error) {
    console.error("Product not found", error);
  }
}
async createProduct(data:any){
await this.client.index({
  index: this.indexName,
  id: data.id.toString(),
  document: data
})
}
async updateProduct(data:any){
await this.client.update({
  index: this.indexName,
  id: data.id.toString(),
  doc: data
})
}
async searchProducts(query:string){
    const  result = await this.client.search({
        index: this.indexName,
        query:{
            multi_match:{
                query:query,
                fields:["title","description"],
                fuzziness:"auto"
            }
        }
    })
     return result.hits.hits.map((hit: any) => hit._source);
}
}