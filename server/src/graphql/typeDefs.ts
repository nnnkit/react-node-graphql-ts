import { gql } from "apollo-server-express";

export const typeDefs = gql`
  input LogInInput {
    code: String!
  }
  type Viewer {
    id: ID
    token: String
    avatar: String
    walletId: String
    didRequest: Boolean!
    hasWallet: Boolean
  }
  type Query {
    authUrl: String!
  }
  type Mutation {
    logIn(input: LogInInput): Viewer!
    logOut: Viewer!
  }
`;
