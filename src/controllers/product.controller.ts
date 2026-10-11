import { Request, Response } from "express";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { T } from "../libs/types/common";
import ProductService from "../models/Product.service";
import { ProductInput } from "../libs/types/product";
import { AdminRequest } from "../libs/types/member";

const productService = new ProductService();

const productController: T = {};
/** SPA */

/** SSR */

productController.getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log("getAllProducts");
        res.render("products");
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

        res.send(`<script> alert("Product Created Successfully!"); window.location.replace('admin/product/all') </script>`);
        res.send("DONE");
    } catch (err) {
        console.log("Error, createNewProduct:", err);
        if (err instanceof Errors) res.status(err.code).json(err);
        else res.status(Errors.standard.code).json(Errors.standard);
    }
};

productController.updateChosenProduct = async (req: Request, res: Response) => {
    try {
        console.log("updateChosenProduct");
    } catch (err) {
        console.log("Error, updateChosenProduct:", err);
        const message = err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
        res.send(`<script> alert("${message}"); window.location.replace('admin/product/all') </script>`);
    }
};
export default productController;