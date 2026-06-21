"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth/auth-client";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
  
    const router = useRouter();
  
    const handleSubmit = async (e: React.SubmitEvent) => {
      e.preventDefault();
  
      setError("");
      setLoading(true);
  
      try {
        const result = await signIn.email({
          email,
          password
        });
  
        if(result.error) {
          setError(result.error.message ?? "Failed to signup");
        } else {
          router.push("/dashboard");
        }
      } catch (err) {
        setError("An unexpected error occurred:" + err);
      } finally {
        setLoading(false);
      }
    }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md border-gray-200 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-black text-center">
            Login
          </CardTitle>
          <CardDescription className="text-gray-600 text-center">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/15 p-2 text-sm text-destructive">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <Label htmlFor="email" className="text-gray-700">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-gray-300 focus:border-primary focus:ring-primary p-5"
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="password" className="text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className=" border-gray-300 focus:border-primary focus:ring-primary p-5"
                />

                {showPassword ?
                  <button onClick={() => setShowPassword(false)}>
                    <EyeOffIcon
                      className="absolute right-4 top-[25%]"
                    />
                  </button>
                  :
                  <button onClick={() => setShowPassword(true)}>
                    <EyeIcon
                      className="absolute right-4 top-[25%]"
                    />
                  </button>
                }
              </div>

            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-lg p-5 cursor-pointer"
            disabled={loading}
            >
              {loading ? <Loader className="mr-2 size-4.5 animate-spin" /> : "Login"}
            </Button>
            <p className="text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary hover:underline"
              >
                Sign Up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

export default Login;