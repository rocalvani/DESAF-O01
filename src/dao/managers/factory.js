import config from "../../config/config.js";
import MDBSingleton from "../../config/MDBSingleton.js";

let productService;

switch (config.persistence) {
  case "mongodb":
    const mongo = async () => {
      try {
        await MDBSingleton.getInstance();
      } catch (error) {
        console.error(error);
        process.exit(0);
      }
    };
    mongo();
    const { default: productServiceMongo } = await import(
      "./db/services/product.service.js"
    );
    productService = productServiceMongo;
    break;
  case "file":
    const { default: productServiceFile } = await import(
      "./filesystem/ProductManager.js"
    );
    productService = productServiceFile;
    break;
    default:
        break;
}

export { productService };
