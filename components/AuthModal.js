"use client";

import { Button } from "@/components/ui/button"
import {
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  
} from "@/components/ui/dialog"

import { createClient } from "@/lib/client";

const googleIcon = "/GoogleIcon.png";


 

export function AuthModal({isOpen , onClose}) {
  const supabase = createClient();

  const handleGoogleLogin = async () => {
  const { origin } = window.location;

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
  }
};


  return (
    <Dialog open = {isOpen} onOpenChange ={onClose}>
      
        
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in to continue</DialogTitle>
            <DialogDescription>
              Track product prices and get alerts on price drops
            </DialogDescription>
          </DialogHeader>


          <div className="flex flex-col gap-4 py-4">
            
           <Button variant="outline" className= "w-full gap-2" size="lg" onClick = {handleGoogleLogin}>
            <img  
            className="w-5 h-5" 
            
            src={googleIcon}/>
                Continue with Google
            </Button>
          </div>
          
          
        </DialogContent>
      
    </Dialog>
  )
}
