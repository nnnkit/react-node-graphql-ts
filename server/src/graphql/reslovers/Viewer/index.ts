import crypto from "crypto";
import { IResolvers } from "apollo-server-express";
import { Viewer, Database, User } from "../../../lib/types";
import { Google } from "../../../lib/api";
import { LogInInput } from "./types";
const logInViaGoogle = async (code: string, token: string, db: Database) => {
  const { user } = await Google.logIn(code);
  const userName = user.names?.[0].displayName;
  const userId = user.names?.[0].metadata?.source?.id;
  const userAvatar = user.photos?.[0]?.url;
  const userEmail = user.emailAddresses?.[0]?.value;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }
  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      token,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      income: 0,
      bookings: [],
      listings: [],
    });

    viewer = insertResult.ops[0];
  }

  if (!user) {
    throw new Error("Google login error");
  }
  return viewer;
};
export const viewerResolver: IResolvers = {
  Query: {
    authUrl(): string {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google auth url`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInInput,
      { db }: { db: Database }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");
        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db)
          : undefined;
        if (!viewer) {
          return { didRequest: true };
        }
        return {
          _id: viewer._id,
          token: viewer.token,
          avatar: viewer.avatar,
          walletId: viewer.walletId,
          didRequest: true,
        };
      } catch (err) {
        throw new Error(`Failed to get user`);
      }
    },
    logOut() {
      return {
        _id: "",
        token: "",
        avatar: "",
        walletId: "",
        didRequest: true,
      };
    },
  },
  Viewer: {
    id: (viewer: Viewer) => viewer._id,
    hasWallet: (viewer: Viewer): boolean | undefined =>
      viewer.walletId ? true : undefined,
  },
};
