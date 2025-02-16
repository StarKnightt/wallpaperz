'use client'

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"

export default function SignIn() {
  return (
    <div className="container mx-auto max-w-md mt-20 p-6">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold">Sign In</h1>
        <div className="space-y-3">
          <Button 
            className="w-full" 
            onClick={() => signIn('github', { callbackUrl: '/' })}
          >
            Continue with GitHub
          </Button>
          <Button 
            className="w-full" 
            onClick={() => signIn('google', { callbackUrl: '/' })}
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  )
}
