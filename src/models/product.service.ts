import Errors, { HttpCode, Message } from "../libs/Errors";
import { shapeIntoMongooseObjectId } from "../libs/config";
import { ProductStatus } from "../libs/enums/product.enum";
import { T } from "../libs/types/common";
import { Product, ProductInput, ProductInquiry, ProductUpdateInput } from "../libs/types/product";
import ProductModel from "../schema/Product.model";
import { Types } from "mongoose";
import ViewService from "./View.service";
import { ViewInput } from "../libs/types/view";
import { ViewGroup } from "../libs/enums/view.enum";

class ProductService {
    private readonly productModel;
    public viewService;

    constructor() {
        this.productModel = ProductModel;
        this.viewService = new ViewService();
    }

    /** SPA */

    public async getProducts(inquiry: ProductInquiry): Promise<Product[]> {
        console.log("inquiry:", inquiry);
        const match: T = { productStatus: ProductStatus.PROCESS };

        if(inquiry.productCollection)
            match.productCollection = inquiry.productCollection;

        if(inquiry.search) {
            match.productName = {
                $regex: new RegExp(
                    inquiry.search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
                    "i"
                ),
            };
        }

        const allowedOrders = ["createdAt", "productPrice", "productViews"];
        const order = allowedOrders.includes(inquiry.order)
            ? inquiry.order
            : "createdAt";
        const page = Number(inquiry.page) > 0 ? Number(inquiry.page) : 1;
        const limit = Number(inquiry.limit) > 0 ? Number(inquiry.limit) : 10;

        const sort: T = order === "productPrice" ? { [order]: 1 } : { [order]: -1 };

        const result = await this.productModel.aggregate([
            { $match: match },
            { $sort: sort },
            { $skip: (page - 1) * limit },
            { $limit: limit },
        ]).exec();
        return result;
    };

    public async getProduct(
        memberId: Types.ObjectId | null,
        id: string
    ): Promise<Product> {
        const productId = shapeIntoMongooseObjectId(id);

        let result = (await this.productModel
            .findOne({
                _id: productId,
                productStatus: ProductStatus.PROCESS,
            })
            .lean()
            .exec()) as unknown as Product | null;
        if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

        if (memberId) {
            // 1. Check view log existence
            const input: ViewInput = {
                memberId: memberId,
                viewRefId: productId,
                viewGroup: ViewGroup.PRODUCT,
            };
            const existView = await this.viewService.checkViewExistence(input);

            if (!existView) {
                // 2. Insert new view log
                await this.viewService.insertMemberView(input);

                // 3. Increase view count (only for a first-time view)
                const updated = (await this.productModel
                    .findByIdAndUpdate(
                        productId,
                        { $inc: { productViews: 1 } },
                        { new: true }
                    )
                    .lean()
                    .exec()) as unknown as Product | null;
                if (updated) result = updated;
            }
        }

        return result;
    }

    /** SSR */

    public async getAllProducts(): Promise<Product[]> {
        return (await this.productModel
            .find()
            .exec()) as unknown as Product[];
    }

    public async createNewProduct(input: ProductInput): Promise<Product> {
        try {
            return (await this.productModel.create(input)) as unknown as Product;
        } catch (err) {
            throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    public async updateChosenProduct(
        id: string,
        input: ProductUpdateInput
    ): Promise<Product> {
        const productId = shapeIntoMongooseObjectId(id);
        const result = (await this.productModel
            .findOneAndUpdate({ _id: productId }, input, { new: true })
            .exec()) as unknown as Product | null;
        if (!result) throw new Errors(HttpCode.BAD_REQUEST, Message.UPDATE_FAILED);

        return result;
    }
}

export default ProductService;

