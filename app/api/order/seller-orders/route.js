import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Order from "@/models/Order";
import Product from "@/models/product";

export async function GET(request) {
    try {
        console.log("🚀 API Route: seller-orders called");
        
        // Use auth() instead of getAuth() for Next.js 15 compatibility
        const authResult = await auth();
        const { userId } = authResult;
        console.log("👤 User ID from Clerk:", userId);
       
        if (!userId) {
            console.log("❌ No userId found");
            return NextResponse.json({
                success: false,
                message: "Not authenticated"
            }, { status: 401 });
        }

        console.log("🔌 Connecting to database...");
        await connectDB();

        // Fetch all orders
        console.log("📋 Fetching all orders...");
        const allOrders = await Order.find({})
            .sort({ date: -1 })
            .lean()
            .exec();
        
        console.log("📋 Total orders in database:", allOrders.length);
        
        // Manually populate product details since populate doesn't work with string refs
        const populatedOrders = await Promise.all(
            allOrders.map(async (order) => {
                const populatedItems = await Promise.all(
                    order.items.map(async (item) => {
                        try {
                            const product = await Product.findById(item.product).lean().exec();
                            return {
                                ...item,
                                product: product || {
                                    _id: item.product,
                                    name: 'Product Not Found',
                                    images: [],
                                    userId: null
                                }
                            };
                        } catch (error) {
                            console.error(`Error fetching product ${item.product}:`, error);
                            return {
                                ...item,
                                product: {
                                    _id: item.product,
                                    name: 'Product Not Found',
                                    images: [],
                                    userId: null
                                }
                            };
                        }
                    })
                );

                return {
                    ...order,
                    items: populatedItems
                };
            })
        );

        console.log("📋 Populated orders:", populatedOrders.length);
        
        // Debug: Log first order structure
        if (populatedOrders.length > 0) {
            console.log("📋 Sample populated order structure:", {
                _id: populatedOrders[0]._id,
                items: populatedOrders[0].items?.map(item => ({
                    productId: item.product?._id?.toString(),
                    productName: item.product?.name,
                    productUserId: item.product?.userId,
                    quantity: item.quantity
                })),
                date: populatedOrders[0].date,
                amount: populatedOrders[0].amount,
                address: populatedOrders[0].address?.fullName
            });
        }

        // Option 1: Show ALL orders (admin view)
        // Uncomment this line if you want to show all orders to sellers
        // const sellerOrders = populatedOrders;

        // Option 2: Filter orders by seller's products
        const sellerOrders = populatedOrders.filter(order =>
            order.items.some(item =>
                item.product && item.product.userId === userId
            )
        );

        console.log("🎯 Filtered orders for seller:", sellerOrders.length);
        console.log("🎯 Order IDs:", sellerOrders.map(o => o._id.toString()));

        // Additional debugging - check product ownership
        if (populatedOrders.length > 0) {
            console.log("🔍 Product ownership debug:");
            populatedOrders.slice(0, 3).forEach((order, index) => {
                console.log(`Order ${index + 1}:`, {
                    orderId: order._id,
                    items: order.items.map(item => ({
                        productName: item.product?.name,
                        productUserId: item.product?.userId,
                        matchesCurrentUser: item.product?.userId === userId
                    }))
                });
            });
        }

        return NextResponse.json({ 
            success: true, 
            orders: sellerOrders,
            debug: {
                userId,
                totalOrdersCount: allOrders.length,
                populatedOrdersCount: populatedOrders.length,
                filteredOrdersCount: sellerOrders.length,
                firstOrderHasProducts: populatedOrders[0]?.items?.length > 0,
                firstProductUserId: populatedOrders[0]?.items?.[0]?.product?.userId
            }
        });

    } catch (error) {
        console.error("💥 Error in seller-orders:", error);
        console.error("💥 Error stack:", error.stack);
        return NextResponse.json({
            success: false,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}