import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: {type: String, required: true, ref:"user"},
    items: [{
        product: { type: String, required: true, ref: "Product" },
        quantity: { type: Number, required: true },
        color: { type: String } // Add color field for product variants
    }],
    amount: {type: Number, required: true},
    totalAmount: { type: Number, required: true },
    address: {
        userId: { type: String },
        fullName: { type: String, required: true },
        PhoneNumber: { type: String, required: true },
        zipcode: { type: String },
        area: { type: String, required: true },
        city: { type: String, required: true },
        province: { type: String, required: true }
    },
    status: {type: String, required: true, default: "Order Placed"},
    date: {type: Number, required: true},
    paymentMethod: {type: String, required: true, default: "Cash on Delivery"},
    originalPrice: { type: Number },
    offerPrice: { type: Number },
    promoCode: { type: String },
    discount: { type: Number, default: 0 },
    discountPercentage: { type: Number, default: 0 }
}, {
    timestamps: true // This will add createdAt and updatedAt fields
})

const Order = mongoose.models.Order || mongoose.model('Order', orderSchema)

export default Order