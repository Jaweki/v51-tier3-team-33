import React, { ReactNode } from "react";
import AppContextDataProvider from "./context/AppContextDataProvider";
import OAuthSessionProvider from "./next-auth-client/OAuthSessionProvider";
import { Toaster } from "@/components/ui/toaster";
import Footer from "./Footer";

const GlobalProviders = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <>
      <OAuthSessionProvider>
        <AppContextDataProvider>{children}</AppContextDataProvider>
      </OAuthSessionProvider>
      <Toaster />
      <Footer />
    </>
  );
};

export default GlobalProviders;
