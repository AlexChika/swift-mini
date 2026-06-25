"use client";

import { usePathname } from "next/navigation";
import LandingPage from "@/components/landing/LandingPage";

type AuthProps = {
  children: React.ReactNode;
};

function Auth(props: AuthProps) {
  const { children } = props;
  const path = usePathname();

  return acceptedPaths.includes(path) ? children : <LandingPage />;
}

export default Auth;

// all authentication agnostic pages
const acceptedPaths = ["/privacy", "/login"];
