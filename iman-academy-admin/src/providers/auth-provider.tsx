"use client";

import { useEffect, useState } from "react";
import { refreshSession } from "../auth";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    refreshSession().finally(() => setReady(true));
  }, []);

  // Swap this for a real splash/skeleton if the blank flash bothers you.
  if (!ready){
    return null;
  }  
  else {
      return <> {children} </>;
  }
}

export default AuthProvider;