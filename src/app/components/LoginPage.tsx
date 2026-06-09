import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
        try {
          const user = await lmsLogin({
            email: adminEmail,
            password: adminPassword,
          });

          // ✅ CHECK LICENSE STATUS (non-blocking)
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
          window.dispatchEvent(new Event('userLoggedIn'));

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
          console.error("Login error:", loginError);
          setHasLoginError(true);
          setErrorMessage("Invalid credentials");
          toast.error("Invalid password or email");
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

        try {
          // Create new customer directly
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
          window.dispatchEvent(new Event('userLoggedIn'));

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
        } catch (err: any) {
          console.error("Registration error:", err);
          
          // If customer already exists, toggle to sign-in mode automatically
          if (err.message?.includes("User already exists") || err.message?.includes("Conflict") || err.status === 409) {
            toast.error("Account already exists. Please sign in.");
            setIsSignUp(false);
          } else {
            setHasLoginError(true);
            setErrorMessage(err.message || "Registration failed");
            toast.error(err.message || "Registration failed");
          }
          setLoading(false);
          return;
        }
      }

    } catch (err: any) {
      console.error("General error:", err);
      setHasLoginError(true);
      setErrorMessage("Something went wrong");
      toast.error(err.message || "Something went wrong");
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
      <DialogContent className="sm:max-w-[425px] bg-white border-[#e2eaf3] text-[#0a1f3d] shadow-[0_24px_64px_rgba(10,31,61,0.18)] rounded-2xl overflow-hidden p-6 [&>button]:text-[#94a3b8] [&>button]:hover:text-[#475569]">
        <DialogHeader className="text-center sm:text-left flex flex-col gap-1.5 pb-4 border-b border-[#e2eaf3]">
          <div className="flex items-center gap-2 mb-1 justify-center sm:justify-start">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-[#00b8d4] to-[#0097b2] flex items-center justify-center shadow-[0_4px_14px_rgba(0,184,212,0.3)]">
              <ShieldCheck className="h-4 w-4 text-white" />
            </div>
            <span className="font-sans font-bold text-lg text-[#0a1f3d] tracking-tight">Trust<span className="text-[#00b8d4]">Layer</span></span>
          </div>
          <DialogTitle className="text-[#0a1f3d] text-xl font-bold font-sans">{isSignUp ? "Create Account" : "Welcome Back"}</DialogTitle>
          <DialogDescription className="text-[#475569] text-sm">
            {isSignUp ? "Sign up to get started with TrustLayer" : "Sign in to access your account"}
          </DialogDescription>
        </DialogHeader>

        <Card className="border-0 bg-transparent shadow-none pt-4">
          <CardHeader className="p-0 pb-3">
            <CardDescription className={hasLoginError ? "text-red-600 font-medium text-sm" : "text-[#475569] text-sm"}>
              {hasLoginError && errorMessage ? errorMessage : "Enter your credentials to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <form onSubmit={handleAdminLogin} className="space-y-4">

              {/* Name field only when signing up */}
              {isSignUp && (
                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-xs font-bold text-[#475569] uppercase tracking-wider">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#f8fbff] border-[#e2eaf3] text-[#0D2244] placeholder:text-[#94a3b8] focus-visible:border-[#00b8d4] focus-visible:ring-[#00b8d4]/20 h-10"
                    required
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="admin-email" className="text-xs font-bold text-[#475569] uppercase tracking-wider">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#94a3b8]" />
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
                    className={`pl-10 bg-[#f8fbff] border-[#e2eaf3] text-[#0D2244] placeholder:text-[#94a3b8] focus-visible:border-[#00b8d4] focus-visible:ring-[#00b8d4]/20 h-10 ${hasLoginError ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="admin-password" className="text-xs font-bold text-[#475569] uppercase tracking-wider">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-[#94a3b8]" />
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
                    className={`pl-10 bg-[#f8fbff] border-[#e2eaf3] text-[#0D2244] placeholder:text-[#94a3b8] focus-visible:border-[#00b8d4] focus-visible:ring-[#00b8d4]/20 h-10 ${hasLoginError ? 'border-red-500' : ''}`}
                    required
                  />
                </div>
              </div>
              
              {!isSignUp && (
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="admin-remember" className="rounded border-[#e2eaf3] bg-[#f8fbff] text-[#00b8d4] focus:ring-[#00b8d4] w-4 h-4 cursor-pointer" />
                    <Label htmlFor="admin-remember" className="text-sm text-[#475569] cursor-pointer hover:text-[#0a1f3d] transition-colors">
                      Remember me
                    </Label>
                  </div>
                  <button type="button" onClick={() => onForgotPassword?.()} className="text-sm text-[#00b8d4] hover:text-[#0097b2] hover:underline bg-transparent border-0 p-0 cursor-pointer font-medium transition-colors">
                    Forgot password?
                  </button>
                </div>
              )}
              
              <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#00b8d4] to-[#0097b2] hover:from-[#00c5e3] hover:to-[#00a8c4] text-white font-bold transition-all shadow-[0_4px_14px_rgba(0,184,212,0.30)] hover:shadow-[0_4px_24px_rgba(0,184,212,0.45)] h-10 rounded-lg border-0 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 duration-150" disabled={loading}>
                <ShieldCheck className="h-4 w-4" />
                {loading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </button>
              
              {/* Toggle between sign in and sign up */}
              <div className="text-center text-sm pt-2">
                <button
                  type="button"
                  onClick={toggleSignUpMode}
                  className="text-[#00b8d4] hover:text-[#0097b2] hover:underline bg-transparent border-0 p-0 cursor-pointer font-medium transition-colors"
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