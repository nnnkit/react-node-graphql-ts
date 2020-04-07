import { MongoClient } from "mongodb";
import { Database } from "../lib/types";
let url = "mongodb://localhost:27017";

export async function connectDatabase(): Promise<Database> {
  const client = await MongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = client.db("listings");
  return {
    listings: db.collection("test_listing"),
  };
}
