import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { toast } from "sonner";
import type { AppState } from "@/App";

type Props = {
  state: AppState;
  updateState: (updater: (prev: AppState) => AppState) => void;
  onSuccess: () => void;
  onStudentLogin: () => void;
};

export function TeacherLogin({ state, updateState, onSuccess, onStudentLogin }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      const user = state.users.find(
        (u) => u.role === "teacher" && u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) {
        toast.error("No teacher account found with this email");
        setLoading(false);
        return;
      }

      // Check if this is the demo teacher account
      if (user.id === "teacher-1") {
        // Demo credentials check
        if (email.toLowerCase() === "teacher@gyandeepclasses.com" && password === "Teacher@123") {
          updateState((prev) => ({ ...prev, currentUser: user }));
          toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
          setLoading(false);
          onSuccess();
          return;
        }
      }

      // Regular password check
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg shadow-indigo-200 mb-4">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">GyanDeep Classes</h1>
          <p className="text-indigo-700 font-medium mt-1">Teacher Portal</p>
        </div>

        <Card className="shadow-xl border-indigo-100 rounded-2xl">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <CardTitle className="text-xl">Teacher Login</CardTitle>
            </div>
            <CardDescription>Manage batches, students, and content</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teacher-email">Gmail / User ID</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="teacher-email"
                    type="email"
                    placeholder="teacher@gyandeepclasses.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="teacher-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="teacher-password"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 text-base"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login to Teacher Dashboard"}
                {!loading && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>
            </form>

            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-100">
              <p className="text-xs text-indigo-700">
                <strong>Demo Credentials:</strong> teacher@gyandeepclasses.com / Teacher@123
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <button
                onClick={onStudentLogin}
                className="w-full flex items-center justify-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Are you a Student? Login here
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