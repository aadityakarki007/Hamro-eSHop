import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";

/** @type {import('mongoose').Model<any>} */
const ProductModel = Product;

export async function GET(request) {
    try {
        await connectDB();

        // Get limit from query params, default to 10 if not provided
        const { searchParams } = new URL(request.url);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? parseInt(limitParam) : 0; // 0 means no limit in MongoDB

        const productsQuery = ProductModel.find({}).sort({ date: -1 });
        if (limit > 0) productsQuery.limit(limit);

        const products = await productsQuery.lean();

        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message });
    }
}
