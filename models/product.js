import mongoose from "mongoose"; // ✅ correct spelling

const reviewSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  date: { type: Number, required: true }
});

const productSchema = new mongoose.Schema({
  userId: { type: String, required: true, ref: "user" },
  sellerName: { type: String, default: "" },
  name: { type: String, required: true },
  description: { type: String, required: true },
  brand: { type: String, default: "Generic" },
  colors: { type: [String], default: [] },      // ✅ multiple colors
  price: { type: Number, required: true },
  offerPrice: { type: Number, required: true },
  shippingFee: { type: Number, default: 15 },
  deliveryCharge: { type: Number, default: 80 },
  images: { type: [String], required: true },   // ✅ image URLs or filenames
  category: { type: String, required: true },

  // Stock & logistics
  stock: { type: Number, default: 0 },
  deliveryDate: { type: String, default: "" },
  warrantyDuration: { type: String, default: "" },
  returnPeriod: { type: String, default: "" },
  isPopular: { type: Boolean, default: false },

  // Category-specific dynamic fields
  flavours: { type: [String], default: [] },     // ✅ array for vapes
  sizes: { type: [String], default: [] },        // ✅ array for clothing
  shoeNumbers: { type: [String], default: [] },  // ✅ array for shoes

  // Reviews
  reviews: [reviewSchema],
  averageRating: { type: Number, default: 0 },

  // Timestamps
  createdAt: { type: Number, required: true }   // Or use: type: Date, default: Date.now
});

// Optional: update timestamp
productSchema.pre("save", function (next) {
  if (!this.createdAt) this.createdAt = Date.now();
  next();
});

const Product = mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
