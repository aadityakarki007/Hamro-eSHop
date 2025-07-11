import { v2 as cloudinary } from "cloudinary";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import authSeller from "@/lib/authSeller";
import connectDB from "@/config/db";
import Product from "@/models/product";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function POST(request) {
  try {
    // Authenticate user
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const isSeller = await authSeller(userId);
    if (!isSeller) {
      return NextResponse.json({ success: false, message: "Not authorized as seller" }, { status: 403 });
    }

    const formData = await request.formData();

    // Basic fields
    const productData = {
      userId,
      sellerName: formData.get("sellerName") || "",
      name: formData.get("name"),
      description: formData.get("description"),
      brand: formData.get("brand") || "Generic",
      
      // Adjust colors field if schema expects string or array, here assuming array is allowed
      colors: formData.get("color") ? formData.get("color").split(",").map(c => c.trim()) : [],

      price: Number(formData.get("price")),
      offerPrice: Number(formData.get("offerPrice")),
      shippingFee: Number(formData.get("shippingFee")) || 0,
      deliveryCharge: Number(formData.get("deliveryCharge")) || 0,
      images: [], // filled below
      category: formData.get("category"),
      stock: Number(formData.get("stock")) || 0,
      deliveryDate: formData.get("deliveryDate") || "",
      warrantyDuration: formData.get("warrantyDuration") || "",
      returnPeriod: formData.get("returnPeriod") || "",
      isPopular: formData.get("isPopular") === "true",
      reviews: [],
      averageRating: 0,
      date: new Date()
    };

    // Make sure category exists and normalize it
    if (!productData.category) {
      return NextResponse.json({
        success: false,
        message: "Category is required"
      }, { status: 400 });
    }

    const category = productData.category.toLowerCase();

    // Assign category-specific fields as strings (comma-separated), NOT arrays
    if (category.includes("vape")) {
      productData.flavours = formData.get("flavours") || "";
    }
    if (category.includes("fashion") || category.includes("clothing")) {
      productData.sizes = formData.get("sizes") || "";
    }
    if (category.includes("shoes") || category.includes("footwear")) {
      productData.shoeNumbers = formData.get("shoeNumbers") || "";
    }

    // Validate required fields
    if (!productData.name || !productData.description || !productData.category ||
      !productData.price || !productData.offerPrice || !productData.sellerName) {
      return NextResponse.json({
        success: false,
        message: "Missing required fields: name, description, category, price, offerPrice, and sellerName are required"
      }, { status: 400 });
    }

    // Upload images to Cloudinary
    const imageFiles = formData.getAll("images");
    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json({
        success: false,
        message: "At least one image is required"
      }, { status: 400 });
    }

    const uploadPromises = imageFiles.map((file, index) => {
      return new Promise(async (resolve, reject) => {
        try {
          if (!file || typeof file.arrayBuffer !== "function" || file.size === 0) {
            reject(new Error(`Invalid file format for image ${index + 1}`));
            return;
          }

          const arrayBuffer = await file.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          const uploadTimeout = setTimeout(() => {
            reject(new Error(`Upload timeout for image ${index + 1}`));
          }, 30000);

          cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "products",
              quality: "auto:good",
              fetch_format: "auto",
              flags: "progressive"
            },
            (error, result) => {
              clearTimeout(uploadTimeout);
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          ).end(buffer);
        } catch (err) {
          reject(err);
        }
      });
    });

    const uploadResults = await Promise.all(uploadPromises);
    productData.images = uploadResults.map(r => r.secure_url);

    // Save to DB
    await connectDB();
    const newProduct = await Product.create(productData);

    return NextResponse.json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    }, { status: 201 });

  } catch (error) {
    console.error("Product add error:", error);

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json({
        success: false,
        message: "Validation error",
        errors: validationErrors
      }, { status: 400 });
    } else if (error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: "Duplicate product information"
      }, { status: 409 });
    } else if (error.message && error.message.includes("timeout")) {
      return NextResponse.json({
        success: false,
        message: "Image upload timeout. Please try again with smaller images."
      }, { status: 408 });
    }

    return NextResponse.json({
      success: false,
      message: error.message || "An error occurred while adding the product"
    }, { status: 500 });
  }
}
