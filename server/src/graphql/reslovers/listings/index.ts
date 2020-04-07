import { IResolvers } from "apollo-server-express";
import { Database, Listing } from "../../../lib/types";
import { ObjectID } from "mongodb";

export const listingsResolver: IResolvers = {
  Query: {
    listing: async (
      _root: undefined,
      _args: {},
      { db }: { db: Database }
    ): Promise<Listing[]> => {
      return await db.listings.find({}).toArray();
    },
  },
  Mutation: {
    deleteListing: async (
      _root,
      { id }: { id: string },
      { db }: { db: Database }
    ): Promise<Listing> => {
      let deletRes = await db.listings.findOneAndDelete({
        _id: new ObjectID(id),
      });
      if (!deletRes.value) {
        throw new Error("Failed to delete");
      }
      return deletRes.value;
    },
  },
  Listing: {
    id: (listing: Listing): string => listing._id.toString(),
  },
};
