"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { UserSchema } from "../models/user/user.schema.zod";
import { useSession } from "next-auth/react";
import { fetchSignedInUser } from "../models/user/user.fetch";

type UserContextProps = {
  user: UserSchema | null;
  setUser: React.Dispatch<React.SetStateAction<UserSchema | null>>;
} | null;

const UserContext = createContext<UserContextProps>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserSchema | null>(null);

  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetchSignedInUser(session).then((signedInUser) => {
        if (signedInUser) {
          setUser(signedInUser);
        }
      });
    } else {
      setUser(null);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
