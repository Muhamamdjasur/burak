import { Member } from "../libs/types/member";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { shapeIntoMongooseObjectId } from "../libs/config";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/Orderitem.model";
import Errors, { HttpCode, Message } from "../libs/Errors";
import { ObjectId } from "mongoose";
import MemberService from "./Member.service";
import { OrderStatus } from "../libs/enums/order.enum";

class OrderService {
    private readonly orderModel;
    private readonly orderItemModel;
    private readonly memberService;
    constructor() {
        this.orderModel = OrderModel;
        this.orderItemModel = OrderItemModel;
        this.memberService = new MemberService()
    }

    public async createOrder(
        member: Member, 
        input: OrderItemInput[]
    ): Promise<Order> {
        const memberId = shapeIntoMongooseObjectId(member._id); 
        const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
            return accumulator + item.itemPrice * item.itemQuantity;
        }, 0);
        const delivery = amount < 100 ? 5 : 0;

        try {
            const newOrder: Order = await this.orderModel.create({
                orderTotal: amount + delivery,
                orderDelivery: delivery,
                memberId: memberId, 
            });
            const orderId = newOrder._id;
            console.log("orderId:", newOrder._id);
            await this.recordOrderItem(newOrder._id, input);
            return newOrder;

        } catch(err) {
            console.log("Error, model:createOrder:", err);
          throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
        }
    }

    private async recordOrderItem(
        orderId: ObjectId, 
        input: OrderItemInput[]
    ): Promise<void> {
        const promisedList = input.map( async (item: OrderItemInput) => {
            item.orderId = orderId;
            item.productId = shapeIntoMongooseObjectId(item.productId);
            await this.orderItemModel.create(item);
            return "INSERTED";

        });
        const orderItemsState = await Promise.all(promisedList);
        console.log("orderItemsState:", orderItemsState);
    }

public async getMyOrders(
    member: Member, 
    inquiry: OrderInquiry
): Promise<Order[]> { 
    const memberId = shapeIntoMongooseObjectId(member._id);
    const matches: any = { memberId: memberId }; 
    if (inquiry.orderStatus) matches.orderStatus = inquiry.orderStatus; 

    // 1. page va limit son ekanligiga ishonch hosil qilish
    const page = Number(inquiry.page) > 0 ? Number(inquiry.page) : 1;
    const limit = Number(inquiry.limit) > 0 ? Number(inquiry.limit) : 10;

    const result = await this.orderModel
    .aggregate([
        { $match: matches },
        { $sort: { updatedAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
            $lookup: {
                // MongoDB Compass'dagi aniq nomga qarang (ko'pincha kichik "orderitems")
                from: "orderItems", 
                localField: "_id",
                foreignField: "orderId",
                as: "orderItems",
            }
        },
        {
            $lookup: {
                from: "products",
                localField: "orderItems.productId",
                foreignField: "_id",
                as: "productData",
            },
        },
    ])
    .exec();

    if (!result) throw new Errors(HttpCode.NOT_FOUND, Message.NO_DATA_FOUND);

    return result;
}

    public async updateOrder(
        member: Member, 
        input: OrderUpdateInput
    ): Promise<Order>  {
        const memberId = shapeIntoMongooseObjectId(member._id);
        const orderId = shapeIntoMongooseObjectId(input.orderId),
        orderStatus = input.orderStatus;

        const oldOrder = await this.orderModel
            .findOne({ memberId: memberId, _id: orderId })
            .exec();
        if (!oldOrder) throw new Errors(HttpCode.NOT_FOUND, Message.UPDATE_FAILED); 

        const result = await this.orderModel.findOneAndUpdate(
            {
                memberId: memberId,
                _id: orderId,
            },
            { orderStatus: orderStatus },
            { new: true }
        )
        .exec();

        if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);


        if(orderStatus === OrderStatus.PROCESS && oldOrder.orderStatus !== OrderStatus.PROCESS) { 
            await this.memberService.addUserPoint(member, 1);
        }
        return result;
    }

}

export default OrderService;