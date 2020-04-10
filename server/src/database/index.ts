import { MongoClient } from "mongodb";
import { Database, Listing, Booking, User } from "../lib/types";
let url = "mongodb://localhost:27017";

export async function connectDatabase(): Promise<Database> {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("tinyhouse");
  return {
    listings: db.collection<Listing>("listings"),
    bookings: db.collection<Booking>("bookings"),
    users: db.collection<User>("users"),
  };
}
