import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput, ProductInquiry } from "../libs/types/product";
import { AdminRequest, ExtendedRequest } from "../libs/types/member";
import { ProductCollection } from "../libs/enums/product.enum";
import { Types } from "mongoose";

const productService = new ProductService();

const productController: T = {};
/** SPA */
productController.getProducts = async (req: Request, res: Response) => {
    try {
        console.log("getProducts");
        // const query = req.query;
        // console.log("query:", query);
        // const params = req.params;
        // console.log("params:", params);
        const { page, limit, order, productCollection, search } = req.query;
        // console.log(req.query);
        const inquery: ProductInquiry = {
            order: String(order),
            page: Number(page),
            limit: Number(limit),
        };
        if(productCollection) 
            inquery.productCollection = productCollection as ProductCollection
        if(search)
            inquery.search = String(search)

        const result = await productService.getProducts(inquery);
        
        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}; 

productController.getProduct = async (req: ExtendedRequest, res: Response) => {
    try {
        console.log("getProduct");

        const { id } = req.params;
        const memberId = (req.member?._id ?? null) as unknown as Types.ObjectId | null,
            result = await productService.getProduct(memberId, id);

        res.status(HttpCode.OK).json(result);
    } catch (err) {
        console.log("Error, getProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
}

/** SSR */

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        const products = await productService.getAllProducts();
        console.log("data:", products);


        res.render("products", { products: products });
    } catch (err) {
        console.log("Error, getAllProducts:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

productController.createNewProduct = async (req: AdminRequest, res: Response) => {
    try {
        console.log("createNewProduct");
        if (!req.files?.length)
            throw new Errors(HttpCode.INTERNAL_SERVER_ERROR, Message.CREATE_FAILED);

        const data: ProductInput = req.body;
        data.productImages = req.files?.map((ele) => {
            return ele.path.replace(/\\/g, "/");
        });

        await productService.createNewPruduct(data);

        res.send(`<script> alert("Product Created Successfully!"); window.location.replace('/admin/product/all') </script>`);
    } catch (err) {
        console.log("Error, createNewProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct");
        const id = req.params.id;

        const result = await productService.updateChosenProduct(id, req.body);

        res.status(HttpCode.OK).json({ data: result });
    } catch (err) {
        console.log("Error, updateChosenProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};
export default productController;