import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Product from "@/models/product";
import { v4 as uuidv4 } from "uuid"; // Optional: if you want to generate unique IDs
import cloudinary from "@/utils/cloudinary"; // Optional: if you're using Cloudinary for image uploads

export async function POST(request) {
  await connectDB();

  try {
    const formData = await request.formData();

    const newProduct = {};

    for (const [key, value] of formData.entries()) {
      if (key === "images") {
        if (!newProduct.images) newProduct.images = [];
        // If using local uploads or Cloudinary, you'd process the file here.
        const buffer = await value.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mime = value.type;
        const dataUri = `data:${mime};base64,${base64}`;
        newProduct.images.push(dataUri); // Save image as base64 string (or upload to Cloudinary)
      } else {
        newProduct[key] = value;
      }
    }

    // Convert numeric fields
    if (newProduct.price) newProduct.price = Number(newProduct.price);
    if (newProduct.offerPrice) newProduct.offerPrice = Number(newProduct.offerPrice);
    if (newProduct.shippingFee) newProduct.shippingFee = Number(newProduct.shippingFee);
    if (newProduct.deliveryCharge) newProduct.deliveryCharge = Number(newProduct.deliveryCharge);
    if (newProduct.stock) newProduct.stock = Number(newProduct.stock);
    newProduct.isPopular = newProduct.isPopular === "true";

    // Add system-generated fields
    newProduct.averageRating = 0;
    newProduct.reviews = [];
    newProduct.date = Date.now();

    const product = new Product(newProduct);
    await product.save();

    return NextResponse.json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
