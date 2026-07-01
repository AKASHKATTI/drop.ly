"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { AuthModal } from "./AuthModal";
import { LogIn, LogOut } from "lucide-react";
import { signOut } from "@/app/action";

const AuthButton = ({ user }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Get username only if user exists
  const userName = user?.email?.split("@")[0];

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <p className="text-sm">
          {/* Signed in as{" "} */}
          <span className="font-semibold">{userName}</span>
        </p>

        <form action={signOut}>
          <Button
            variant="ghost"
            size="sm"
            type="submit"
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <Button
        onClick={() => setShowAuthModal(true)}
        variant="default"
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 gap-2 px-5 py-2 text-sm text-white"
      >
        <LogIn className="w-4 h-4" />
        Log In
      </Button>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default AuthButton;