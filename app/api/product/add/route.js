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
        // Get user ID from Clerk
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a seller
        const isSeller = await authSeller(userId);
        console.log('Is user a seller?', isSeller);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Not authorized as seller" }, { status: 403 });
        }

        // Parse form data
        const formData = await request.formData();
        
        // Extract basic product data
        const productData = {
            userId,
            sellerName: formData.get('sellerName') || '',
            name: formData.get('name'),
            description: formData.get('description'),
            brand: formData.get('brand') || 'Generic',
            color: formData.get('color') || 'Multi',
            price: Number(formData.get('price')),
            offerPrice: Number(formData.get('offerPrice')),
            shippingFee: Number(formData.get('shippingFee')) || 0,
            deliveryCharge: Number(formData.get('deliveryCharge')) || 0,
            images: [], // Will be populated after upload
            category: formData.get('category'),
            stock: Number(formData.get('stock')) || 0,
            deliveryDate: formData.get('deliveryDate') || '',
            warrantyDuration: formData.get('warrantyDuration') || '',
            returnPeriod: formData.get('returnPeriod') || '',
            isPopular: formData.get('isPopular') === 'true',
            sellerId: userId, // Add sellerId for proper seller management
            reviews: [],
            averageRating: 0,
            date: Date.now()
        };
        
        // ✅ Extract category-specific data
        const categorySpecific = {};
        const category = formData.get('category');
        
        switch (category) {
            case 'Vapes & Drinks':
                categorySpecific.flavor = formData.get('flavor') || '';
                categorySpecific.nicotineStrength = formData.get('nicotineStrength') || '';
                categorySpecific.volume = formData.get('volume') || '';
                
                // Validate required fields for Vapes & Drinks
                if (!categorySpecific.flavor) {
                    return NextResponse.json({
                        success: false,
                        message: 'Flavor is required for Vapes & Drinks category'
                    }, { status: 400 });
                }
                break;
                
            case 'Electronic & Accessories':
            case 'Mobiles & Laptops':
                categorySpecific.model = formData.get('model') || '';
                categorySpecific.storage = formData.get('storage') || '';
                categorySpecific.processor = formData.get('processor') || '';
                categorySpecific.screenSize = formData.get('screenSize') || '';
                break;
                
            case 'Health & Beauty':
                categorySpecific.skinType = formData.get('skinType') || '';
                categorySpecific.ingredients = formData.get('ingredients') || '';
                break;
                
            case 'Men\'s Fashion':
            case 'Women\'s Fashion':
            case 'Clothing Accessories':
                categorySpecific.size = formData.get('size') || '';
                categorySpecific.material = formData.get('material') || '';
                break;
                
            case 'Babies & Toys':
                categorySpecific.ageRange = formData.get('ageRange') || '';
                categorySpecific.safetyStandards = formData.get('safetyStandards') || '';
                break;
                
            case 'Sports & Outdoor':
                categorySpecific.weight = formData.get('weight') || '';
                categorySpecific.dimensions = formData.get('dimensions') || '';
                break;
                
            default:
                // For categories without specific fields, you can still store custom data
                categorySpecific.customField1 = formData.get('customField1') || '';
                categorySpecific.customField2 = formData.get('customField2') || '';
                break;
        }
        
        // Add category-specific data to product
        productData.categorySpecific = categorySpecific;
        
        // Validate required fields
        if (!productData.name || !productData.description || !productData.category || 
            !productData.price || !productData.offerPrice || !productData.sellerName) {
            return NextResponse.json({
                success: false,
                message: 'Missing required fields: name, description, category, price, offerPrice, and sellerName are required'
            }, { status: 400 });
        }

        // Handle image uploads
        const imageFiles = formData.getAll('images');
        if (!imageFiles || imageFiles.length === 0) {
            return NextResponse.json({ 
                success: false, 
                message: "At least one image is required" 
            }, { status: 400 });
        }
        
        // Upload files to Cloudinary
        const uploadPromises = imageFiles.map((file, index) => {
            return new Promise(async (resolve, reject) => {
                try {
                    // Check if file is valid
                    if (!file || typeof file.arrayBuffer !== 'function' || file.size === 0) {
                        console.error(`Invalid file at index ${index}:`, file);
                        reject(new Error(`Invalid file format for image ${index + 1}`));
                        return;
                    }
                    
                    const arrayBuffer = await file.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    
                    // Add timeout to prevent hanging uploads
                    const uploadTimeout = setTimeout(() => {
                        reject(new Error(`Upload timeout for image ${index + 1}`));
                    }, 30000); // 30 second timeout
                    
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
                                console.error(`Cloudinary upload error for image ${index + 1}:`, error);
                                reject(error);
                            } else {
                                resolve(result);
                            }
                        }
                    ).end(buffer);
                } catch (err) {
                    console.error(`Error processing image ${index + 1}:`, err);
                    reject(err);
                }
            });
        });
        
        const uploadResults = await Promise.all(uploadPromises);
        const images = uploadResults.map(result => result.secure_url);
        
        // Add uploaded images to product data
        productData.images = images;
        
        // Connect to database and create product
        await connectDB();
        const newProduct = await Product.create(productData);
        
        console.log('Saved product:', newProduct);

        return NextResponse.json({ 
            success: true, 
            message: "Product added successfully", 
            product: newProduct 
        }, { status: 201 });

    } catch (error) {
        console.error("Product add error:", error);
        
        // Check for specific error types
        if (error.name === 'ValidationError') {
            // Mongoose validation error
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return NextResponse.json({ 
                success: false, 
                message: "Validation error",
                errors: validationErrors
            }, { status: 400 });
        } else if (error.code === 11000) {
            // Duplicate key error
            return NextResponse.json({ 
                success: false, 
                message: "Duplicate product information"
            }, { status: 409 });
        } else if (error.message && error.message.includes('timeout')) {
            // Upload timeout error
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