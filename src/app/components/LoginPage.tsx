import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { lmsLogin, lmsRegister, saveSession, type AuthUser } from "../services/authService";

const PRODUCT_ID = '6a26929078d2d302b575cc10';
const LMS_API_KEY = 'my-secret-key-123';
const LMS_BASE   = 'https://lisence-system.onrender.com';

interface LoginPageProps {
  onForgotPassword?: () => void;
  onClose?: () => void;
  onSuccess?: (user: AuthUser) => void;
  onNavigateToPricing?: () => void;
}

export default function LoginPage({ onForgotPassword, onClose, onSuccess, onNavigateToPricing }: LoginPageProps) {
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasLoginError, setHasLoginError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const checkActiveLicense = async (email: string): Promise<boolean> => {
    try {
      console.log('Checking active license for:', email);
      const response = await fetch(
        `${LMS_BASE}/api/external/actve-license/${encodeURIComponent(email)}?productId=${PRODUCT_ID}`,
        {
          headers: {
            "x-api-key": LMS_API_KEY,
          },
        }
      );

      console.log('License check response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('License check response data:', data);
        
        // Check if activeLicense exists and status is 'active'
        const hasLicense = data.activeLicense && data.activeLicense.status === 'active';
        console.log('Has active license:', hasLicense);
        return hasLicense;
      }
      console.log('License check failed - response not ok');
      return false;
    } catch (error) {
      console.error("Error checking active license:", error);
      return false;
    }
  };

  const checkCustomerExists = async (email: string): Promise<boolean> => {
    try {
      const res = await fetch(
        `${LMS_BASE}/api/external/actve-license/${encodeURIComponent(email)}?productId=${PRODUCT_ID}`,
        { headers: { 'x-api-key': LMS_API_KEY } }
      );
      if (res.status === 404) {
        const data = await res.json();
        if (data?.message === 'User not found') {
          return false;
        }
      }
      return true;
    } catch {
      return true;
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasLoginError(false);
    setErrorMessage("");

    if (!adminEmail || !adminPassword) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      // ----------------------------
      // SIGN IN FLOW
      // ----------------------------
      if (!isSignUp) {
        // STEP 1: Check if email exists in database
        const exists = await checkCustomerExists(adminEmail);

        if (!exists) {
          // Email doesn't exist - redirect to sign up
          toast.error("Account not found. Please create an account.");
          setIsSignUp(true);
          setHasLoginError(true);
          setErrorMessage("Account not found");
          setLoading(false);
          return;
        }

        // STEP 2: Email exists - now validate password
        try {
          const user = await lmsLogin({
            email: adminEmail,
            password: adminPassword,
          });

          // ✅ CHECK LICENSE STATUS
          const hasActiveLicense = await checkActiveLicense(adminEmail);

          // Store user data from successful login with license status in localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              name: user.name,
              email: user.email,
              hasActiveLicense: hasActiveLicense,
            })
          );

          // Save session
          saveSession(user);

          // Call the parent handler
          onSuccess?.(user);

          // Dispatch event to notify Navbar of login status change
          window.dispatchEvent(new Event('userLoginStatusChanged'));

          // ✅ CLOSE MODAL
          onClose?.();

          // Reset form
          setAdminEmail("");
          setAdminPassword("");
          setName("");
          setIsSignUp(false);

          toast.success("Login successful! Welcome back.");

          // 🎯 Show appropriate message based on license status
          if (!hasActiveLicense) {
            setTimeout(() => {
              toast.info("Get started with a plan to unlock all features!", {
                action: {
                  label: "View Plans",
                  onClick: () => onNavigateToPricing?.(),
                },
                duration: 6000,
              });
            }, 500);
          } else {
            toast.success("Access your dashboard from the user menu in the top right!");
          }
        } catch (loginError: any) {
          // Handle password validation errors
          console.error("Login error:", loginError);
          setHasLoginError(true);
          setErrorMessage("Invalid credentials");
          toast.error("Invalid password");
          setLoading(false);
          return;
        }
      }

      // ----------------------------
      // SIGN UP FLOW
      // ----------------------------
      if (isSignUp) {
        if (!name) {
          toast.error("Name is required to create account");
          setLoading(false);
          return;
        }

        // Check if customer already exists
        const exists = await checkCustomerExists(adminEmail);
        if (exists) {
          toast.error("Account already exists. Please sign in.");
          setIsSignUp(false);
          setLoading(false);
          return;
        }

        // Create new customer
        const user = await lmsRegister({
          name,
          email: adminEmail,
          password: adminPassword,
        });

        // ✅ CHECK LICENSE STATUS for new user
        const hasActiveLicense = await checkActiveLicense(adminEmail);

        // Store user data with license status
        localStorage.setItem(
          "user",
          JSON.stringify({
            name: name,
            email: adminEmail,
            hasActiveLicense: hasActiveLicense,
          })
        );

        // Save session
        saveSession(user);

        // Call parent handlers
        onSuccess?.(user);

        // Dispatch event to notify Navbar of login status change
        window.dispatchEvent(new Event('userLoginStatusChanged'));

        // ✅ CLOSE MODAL
        onClose?.();

        // Reset form
        setAdminEmail("");
        setAdminPassword("");
        setName("");
        setIsSignUp(false);

        toast.success("Account created successfully! Welcome to TrustLayer.");

        // Show pricing prompt for new users
        setTimeout(() => {
          toast.info("Get started with a plan to unlock all features!", {
            action: {
              label: "View Plans",
              onClick: () => onNavigateToPricing?.(),
            },
            duration: 6000,
          });
        }, 500);
      }

    } catch (err: any) {
      console.error("General error:", err);
      setHasLoginError(true);
      setErrorMessage("Something went wrong");
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // Reset error state when switching between sign in/sign up
  const toggleSignUpMode = () => {
    setIsSignUp(!isSignUp);
    setHasLoginError(false);
    setErrorMessage("");
    setAdminPassword("");
    setName("");
  };

  return (
    <Dialog open={true} onOpenChange={(openVal) => { if (!openVal) onClose?.(); }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isSignUp ? "Create Account" : "Login to TrustLayer"}</DialogTitle>
          <DialogDescription>
            {isSignUp ? "Sign up to get started with TrustLayer" : "Sign in to access your account"}
          </DialogDescription>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardDescription className={hasLoginError ? "text-red-500 font-medium" : ""}>
              {hasLoginError && errorMessage ? errorMessage : "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAdminLogin} className="space-y-4">

              {/* Name field only when signing up */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-email"
                    type="email"
                    placeholder="email@gmail.com"
                    value={adminEmail}
                    onChange={(e) => {
                      setAdminEmail(e.target.value);
                      setHasLoginError(false);
                      setErrorMessage("");
                    }}
                    className={`pl-10 ${hasLoginError ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => {
                      setAdminPassword(e.target.value);
                      setHasLoginError(false);
                      setErrorMessage("");
                    }}
                    className={`pl-10 ${hasLoginError ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
              </div>
              
              {!isSignUp && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="admin-remember" className="rounded" />
                    <Label htmlFor="admin-remember" className="text-sm cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <button type="button" onClick={() => onForgotPassword?.()} className="text-sm text-primary hover:underline bg-transparent border-0 p-0 cursor-pointer">
                    Forgot password?
                  </button>
                </div>
              )}
              
              <Button type="submit" className="w-full" disabled={loading}>
                <ShieldCheck className="h-4 w-4 mr-2" />
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
              
              {/* Toggle between sign in and sign up */}
              <div className="text-center text-sm mt-4">
                <button
                  type="button"
                  onClick={toggleSignUpMode}
                  className="text-primary hover:underline bg-transparent border-0 p-0 cursor-pointer"
                >
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}