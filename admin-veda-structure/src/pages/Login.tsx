import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sun, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import authService from "@/services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@vedastructure.com");
  const [password, setPassword] = useState("admin123");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authService.login({ email, password });
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("user", JSON.stringify(response.user));
      navigate("/admin/dashboard");
    } catch (err) {
      setError((err as Error).message || "Unable to login.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-saffron-500 via-saffron-600 to-purple-700 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.2) 0%, transparent 40%)",
          }}
        />
        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sun className="w-7 h-7" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold">Veda Structure</h1>
              <p className="text-xs text-white/70 tracking-wider uppercase mt-0.5">
                Spiritual Platform
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-4xl font-bold leading-tight mb-4">
              Ancient Wisdom,
              <br />
              Modern Platform
            </h2>
            <p className="text-white/80 text-lg max-w-md leading-relaxed">
              Manage your spiritual products, courses, consultations, and
              bookings — all from one elegant dashboard.
            </p>
          </div>

          <div className="flex items-center gap-8 text-sm">
            <div>
              <p className="text-3xl font-bold">8K+</p>
              <p className="text-white/60">Customers</p>
            </div>
            <div>
              <p className="text-3xl font-bold">128</p>
              <p className="text-white/60">Products</p>
            </div>
            <div>
              <p className="text-3xl font-bold">24</p>
              <p className="text-white/60">Courses</p>
            </div>
            <div>
              <p className="text-3xl font-bold">356</p>
              <p className="text-white/60">Bookings</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-cream-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-saffron-400 to-saffron-600 flex items-center justify-center">
              <Sun className="w-7 h-7 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-charcoal-800">
                Veda Structure
              </h1>
              <p className="text-xs text-charcoal-400 tracking-wider uppercase">
                Admin Portal
              </p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-charcoal-800">
              Welcome Back
            </h2>
            <p className="text-charcoal-400 mt-1.5">
              Veda Structure Admin Portal — sign in to continue.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="label-field">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@vedastructure.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-field">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-300" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-300 hover:text-charcoal-500"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-cream-300 text-saffron-500 focus:ring-saffron-300"
                />
                <span className="text-sm text-charcoal-600">Remember me</span>
              </label>
              <Link
                to="/admin/login"
                className="text-sm text-saffron-600 hover:text-saffron-700 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 text-base"
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-center text-xs text-charcoal-300 mt-8">
            Demo credentials are pre-filled. Just click Login to Dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
