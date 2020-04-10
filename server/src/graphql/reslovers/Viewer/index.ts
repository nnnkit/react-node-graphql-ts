import { IResolvers } from "apollo-server-express";

export const viewerResolver: IResolvers = {
  Query: {
    authUrl() {
      return "AuthUrl";
    },
  },
  Mutation: {
    logIn() {
      return "Login";
    },
    logOut() {
      return "Logout";
    },
  },
};
