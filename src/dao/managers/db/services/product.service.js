import {productModel} from "../models/products.js"

export default class productService {
    constructor() { 
        console.log("Working courses with Database persistence in mongodb");
    }

    static async get() {
        let products = await productModel.find();
        return products.map(el=>el.toObject());
    }
    
   static async save(el) {
        let result = await productModel.create(el);
        return result;
    }

    static async find(el){
        let result = await productModel.findById(el)
        return result;
    }

    static async delete(el) {
        let del = await productModel.deleteOne(el._id);
        return del
    }

    static async findByName(name){
        const result = await productModel.findOne({title: name});
        return result;
    };

    static async update(id, data){
        let result = await productModel.updateOne(
            {
              _id: id,
            },
            {
              $set: {
                stock: data,
              },
            }
          );
          return result;

    }

    static async populated(id) {
        let result = await productModel
        .findOne({ _id: id })
        .populate("owner");
    return result;
      }
}