import { connectDatabase } from "../src/database";

(async function clear() {
  try {
    console.log("clearing started");
    const db = await connectDatabase();
    const listings = await db.listings.find({}).toArray();
    const users = await db.users.find({}).toArray();
    const bookings = await db.bookings.find({}).toArray();

    bookings.length > 0 && (await db.bookings.drop());
    listings.length > 0 && (await db.listings.drop());
    users.length > 0 && (await db.users.drop());
    console.log("Clearing ended");
  } catch (error) {
    throw new Error("Failed to clear data form database");
  }
})();
