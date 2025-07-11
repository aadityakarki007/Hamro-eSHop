import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Address from "@/models/address";

export async function POST(request) {
  try {
    // Connect to DB
    await connectDB();

    // Get Clerk user ID
    const { userId } = getAuth(request);
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "Please sign up or log in to add your delivery address" },
        { status: 401 }
      );
    }

    // Parse address data
    const { addressData } = await request.json();
    if (!addressData) {
      return NextResponse.json(
        { success: false, message: "Address data is required" },
        { status: 400 }
      );
    }

    // Create new Address doc
    const newAddress = new Address({
  userId,
  fullName: addressData.fullName,
  PhoneNumber: addressData.phoneNumber, // Capital P as in schema
  zipcode: addressData.zipcode,
  area: addressData.area,
  city: addressData.district,
  province: addressData.province,
});

    // Save to DB
    await newAddress.save();

    return NextResponse.json(
      { success: true, message: "Address added successfully", newAddress },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error adding address:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error adding address",
      },
      { status: 500 }
    );
  }
}
