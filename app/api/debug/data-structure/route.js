import { NextResponse } from "next/server"
import connectDB from "@/config/db"
import Order from "@/models/Order"
import Product from "@/models/product"
import User from "@/models/user"

export async function GET(request) {
    try {
        await connectDB()

        // Get basic counts
        const orderCount = await Order.countDocuments()
        const productCount = await Product.countDocuments()
        const userCount = await User.countDocuments()

        // Get sample data
        const sampleOrders = await Order.find({}).limit(3).lean().exec()
        const sampleProducts = await Product.find({}).limit(3).lean().exec()
        const sampleUsers = await User.find({}).limit(3).lean().exec()

        return NextResponse.json({
            success: true,
            counts: {
                orders: orderCount,
                products: productCount,
                users: userCount
            },
            samples: {
                orders: sampleOrders.map(order => ({
                    _id: order._id,
                    userId: order.userId,
                    itemCount: order.items?.length || 0,
                    amount: order.amount,
                    status: order.status,
                    date: order.date
                })),
                products: sampleProducts.map(product => ({
                    _id: product._id,
                    name: product.name,
                    hasImages: !!product.images?.length
                })),
                users: sampleUsers.map(user => ({
                    _id: user._id,
                    clerkId: user.clerkId || user.clerk_id || user.userId,
                    email: user.email
                }))
            }
        })

    } catch (error) {
        console.error("Debug API Error:", error)
        return NextResponse.json({
            success: false,
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 })
    }
}