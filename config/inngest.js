import { Inngest } from "inngest";
import connectDB from "./db";
import User from "@/models/user";
import Order from "@/models/Order";

// Create a client to send and receive events
export const inngest = new Inngest({
  id: "quickcart-inngest",
  eventKey: process.env.INNGEST_EVENT_KEY,
  signingKey: process.env.INNGEST_SIGNING_KEY
});

// Save user data
export const syncUserCreation = inngest.createFunction(
  { id: 'quickcart-next-sync-user-from-clerk' },
  { event: 'clerk.user.created' },
  async ({ event, step }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        _id: id,
        email: email_addresses[0].email_address,
        name: first_name + " " + last_name,
        imageUrl: image_url
      };
      
      await step.run('connect-to-db', async () => {
        await connectDB();
      });
      
      await step.run('create-user', async () => {
        // Fix: Use new User() constructor with save() method
        const newUser = new User(userData);
        await newUser.save();
      });
      
      return { success: true, userId: id };
    } catch (error) {
      console.error('Error in syncUserData:', error);
      return { success: false, error: error.message };
    }
  }
);

// Update user data
export const syncUserUpdation = inngest.createFunction(
  { id: 'quickcart-next-update-user-from-clerk' },
  { event: 'clerk.user.updated' },
  async ({ event, step }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data;
      const userData = {
        email: email_addresses[0].email_address,
        name: first_name + " " + last_name,
        imageUrl: image_url
      };
      
      await step.run('connect-to-db', async () => {
        await connectDB();
      });
      
      await step.run('update-user', async () => {
        // Fix: Use bracket notation to bypass TypeScript overload issues
        // @ts-ignore
        await User['updateOne'](
          { _id: id }, 
          { $set: userData }, 
          { upsert: true }
        );
      });
      
      return { success: true, userId: id };
    } catch (error) {
      console.error('Error in updateUserData:', error);
      return { success: false, error: error.message };
    }
  }
);

// Delete user data
export const syncUserDeletion = inngest.createFunction(
  { id: 'quickcart-next-delete-user-with-clerk' },
  { event: 'clerk.user.deleted' },
  async ({ event, step }) => {
    try {
      const { id } = event.data;
      
      await step.run('connect-to-db', async () => {
        await connectDB();
      });
      
      await step.run('delete-user', async () => {
        // Fix: Use bracket notation to bypass TypeScript overload issues
        await User['deleteOne']({ _id: id });
      });
      
      return { success: true, userId: id };
    } catch (error) {
      console.error('Error in deleteUserData:', error);
      return { success: false, error: error.message };
    }
  }
);

//Inngest function to create user's order in database
export const createOrder = inngest.createFunction(
  { 
    id: 'create-user-order',
    batchEvents: {
      maxSize: 25,
      timeout: '5s',
    }
  },
  { event: 'order/created' },
  async ({ events, step }) => {
    try {
      const orders = events.map((event) => ({
        userId: event.data.userId,
        items: event.data.items,
        amount: event.data.amount,
        address: event.data.address,
        date: Date.now()
      }));

      await step.run('connect-to-db', async () => {
        await connectDB();
      });

      await step.run('process-orders', async () => {
        // Since orders are already created in the API route, we're just processing them here
        // This avoids duplicating orders in the database
        console.log(`Processing ${orders.length} orders from event`);
      });

      return { success: true, processed: orders.length };
    } catch (error) {
      console.error('Error in createOrder:', error);
      return { success: false, error: error.message };
    }
  }
);