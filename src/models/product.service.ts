import Errors, { HttpCode, Message } from "../libs/Errors";
import { Product, ProductInput } from "../libs/types/product";
import productModel from "../schema/product.model";

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = productModel;
    }

    /** SPA */

    /** SSR */

    public async createNewPruduct(input: ProductInput): Promise<Product> {
        try {
            return await this.productModel.create(input);
        } catch (err) {
            console.error("Error, model:createNewPruduct:", err);
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }
}

export default ProductService; 