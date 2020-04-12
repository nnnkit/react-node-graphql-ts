import crypto from "crypto";
import { Response, Request } from "express";
import { IResolvers } from "apollo-server-express";
import { Viewer, Database, User } from "../../../lib/types";
import { Google } from "../../../lib/api";
import { LogInInput } from "./types";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: false,
};
const logInViaGoogle = async (
  code: string,
  token: string,
  db: Database,
  res: Response
) => {
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
  res.cookie("viewer", userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });
  return viewer;
};
const logInViaCookies = async (
  token: string,
  db: Database,
  req: Request,
  res: Response
): Promise<User | undefined> => {
  const updateRes = await db.users.findOneAndUpdate(
    {
      _id: req.signedCookies.viewer,
    },
    { $set: { token } },
    { returnOriginal: false }
  );
  let viewer = updateRes.value;
  if (!viewer) {
    res.clearCookie("viewer", cookieOptions);
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
      { db, res, req }: { db: Database; res: Response; req: Request }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");
        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookies(token, db, req, res);
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
    logOut(_root: undefined, _args: {}, { res }: { res: Response }) {
      res.clearCookie("viewer", cookieOptions);
      return {
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
