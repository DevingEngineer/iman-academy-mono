// components/GoogleSignInButton.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { setAccessToken } from "../lib/auth";

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleSignInButton() {
  const buttonRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.google && buttonRef.current) {
        clearInterval(interval);

        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 280,
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  async function handleCredentialResponse(response: { credential: string }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/frontend/google-id-token`, {
      method: "POST",
      credentials: "include", // so the refresh-token cookie gets set
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: response.credential }),
    });

    if (!res.ok) {
      console.error("Google sign-in failed", await res.text());
      return;
    }

    const data = await res.json(); // { accessToken }
    setAccessToken(data.accessToken);
    router.push("/");
  }

  return <div ref={buttonRef} />;
}