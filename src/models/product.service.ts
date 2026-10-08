import productModel from "../schema/product.model";

class ProductService {
    private readonly productModel;

    constructor() {
        this.productModel = productModel;
    }
}

export default ProductService; 