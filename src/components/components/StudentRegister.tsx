import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, UserRound, Phone, Mail, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { AppState, User } from "@/App";

type Props = {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onSuccess: () => void;
  onBack: () => void;
};

export function StudentRegister({ state, updateState, onSuccess, onBack }: Props) {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validateName = (value: string) => {
    return value.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(value.trim());
  };

  const validateMobile = (value: string) => {
    return /^[6-9]\d{9}$/.test(value);
  };

  const validateEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validatePassword = (value: string) => {
    return value.length >= 8 && /[A-Z]/.test(value) && /[0-9]/.test(value);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateName(name)) {
      toast.error("Please enter a valid full name (letters only, min 3 characters)");
      setLoading(false);
      return;
    }

    if (!validateMobile(mobile)) {
      toast.error("Please enter a valid Indian mobile number (10 digits, starts with 6-9)");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validatePassword(password)) {
      toast.error("Password must be 8+ characters with at least 1 uppercase letter and 1 number");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (state.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      toast.error("An account with this email already exists");
      setLoading(false);
      return;
    }

    setTimeout(() => {
      const newUser: User = {
        id: `student-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
        role: "student",
        joinedAt: new Date().toISOString().split("T")[0],
      };

      localStorage.setItem(`password-${newUser.id}`, password);

      updateState((prev) => ({
        ...prev,
        users: [...prev.users, newUser],
        currentUser: newUser,
      }));

      toast.success("Account created successfully! Welcome to GyanDeep Classes!");
      setLoading(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">GyanDeep Classes</h1>
          <p className="text-emerald-700 font-medium mt-1">Create Student Account</p>
        </div>

        <Card className="shadow-xl border-emerald-100 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Student Registration</CardTitle>
            <CardDescription>Join GyanDeep Classes and start learning</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reg-name">Full Name</Label>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="reg-name"
                    placeholder="e.g. Rahul Sharma"
                    className="pl-10"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-mobile">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="reg-mobile"
                    type="tel"
                    placeholder="10-digit mobile number"
                    className="pl-10"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/[^0-9]/g, "").slice(0, 10))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-email">Gmail / Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="student@gmail.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="reg-password"
                    type="password"
                    placeholder="Min 8 chars, 1 uppercase, 1 number"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="reg-confirm"
                    type="password"
                    placeholder="Re-enter your password"
                    className="pl-10"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
                disabled={loading}
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-4">
              <button
                onClick={onBack}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Student Login
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}