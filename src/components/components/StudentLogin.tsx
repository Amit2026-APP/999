import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, ArrowRight, UserRound, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { AppState } from "@/App";

type Props = {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onSuccess: () => void;
  onRegister: () => void;
  onTeacherLogin: () => void;
};

export function StudentLogin({ state, updateState, onSuccess, onRegister, onTeacherLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = state.users.find(
        (u) => u.role === "student" && u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        toast.error("No student account found with this email");
        setLoading(false);
        return;
      }

      const storedPassword = localStorage.getItem(`password-${user.id}`);
      if (storedPassword !== password) {
        toast.error("Incorrect email or password");
        setLoading(false);
        return;
      }

      updateState((prev) => ({ ...prev, currentUser: user }));
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      setLoading(false);
      onSuccess();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-600 shadow-lg shadow-emerald-200 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">GyanDeep Classes</h1>
          <p className="text-emerald-700 font-medium mt-1">Learn | Grow | Achieve</p>
        </div>

        <Card className="shadow-xl border-emerald-100 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <UserRound className="w-5 h-5 text-emerald-600" />
              <CardTitle className="text-xl">Student Login</CardTitle>
            </div>
            <CardDescription>Access your batches, videos, and study material</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="student-email">Gmail / Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="student-email"
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
                <Label htmlFor="student-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="student-password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 h-11 text-base"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to Dashboard"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-500">
                New student?{" "}
                <button
                  onClick={onRegister}
                  className="text-emerald-600 font-semibold hover:underline"
                >
                  Create an account
                </button>
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <button
                onClick={onTeacherLogin}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Are you a Teacher? Login here
              </button>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-slate-400 mt-6">
          © 2026 GyanDeep Classes. All rights reserved.
        </p>
      </div>
    </div>
  );
}