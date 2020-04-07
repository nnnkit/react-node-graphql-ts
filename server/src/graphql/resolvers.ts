import { listings } from "../listing";
import { IResolvers } from "apollo-server-express";

export const resolvers: IResolvers = {
  Query: {
    listing: () => {
      return listings;
    },
  },
  Mutation: {
    deleteListing: (_root, { id }: { id: string }) => {
      let index = listings.findIndex((l) => l.id === id);
      listings.splice(index, 1);
      return listings[index];
    },
  },
};
