import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

import { clearAuthError, loginUser } from "../authSlice";
import AuthHeader from "./AuthHeader";
import { useToast } from "../../../components/ui/toastContext";

const fieldClass = `
  h-[50px]
  w-full
  rounded-[11px]
  border
  border-[#e5dac6]
  bg-[#fffdf9]
  px-4
  text-[14px]
  text-[#17130f]
  outline-none
  transition-all
  placeholder:text-[#9c9387]
  hover:border-[#d5c4a7]
  focus:border-[#d6a13b]
  focus:ring-4
  focus:ring-[#d6a13b]/10
`;

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useSelector((state) => state.auth);
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      dispatch(clearAuthError());
    }
  }, [dispatch, error, showToast]);

  const handleChange = ({ target: { name, value } }) => {
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await dispatch(loginUser(formData));

    if (loginUser.fulfilled.match(result)) {
      showToast("Logged in successfully.");
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      <AuthHeader
        activeTab="login"
        title="Welcome back"
        subtitle="Sign in to continue your journey."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-[14px] font-semibold text-[#17130f]"
          >
            Email or mobile number
          </label>

          <input
            id="email"
            name="email"
            type="text"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className={fieldClass}
          />
        </div>

        {/* Password */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="password"
              className="text-[14px] font-semibold text-[#17130f]"
            >
              Password
            </label>

            <Link
              to="/forgot-password"
              className="text-[13px] font-medium text-[#17130f] underline underline-offset-4 hover:opacity-70"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`${fieldClass} pr-12`}
            />

            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((value) => !value)}
              className="
                absolute
                inset-y-0
                right-0
                grid
                w-12
                place-items-center
                text-[#83796c]
                transition
                hover:text-[#17130f]
              "
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.7} />
              ) : (
                <Eye size={18} strokeWidth={1.7} />
              )}
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isLoading}
          className="
            h-[52px]
            w-full
            rounded-[11px]
            bg-[#e2ad38]
            px-5
            text-[14px]
            font-semibold
            text-[#17130f]
            shadow-[0_8px_20px_rgba(190,145,50,0.18)]
            transition-all
            hover:bg-[#d9a22e]
            hover:shadow-[0_10px_24px_rgba(190,145,50,0.24)]
            active:scale-[0.99]
            disabled:cursor-not-allowed
            disabled:opacity-60
          "
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-4 py-1">
          <span className="h-px flex-1 bg-[#e5dac6]" />

          <span className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#81766a]">
            OR
          </span>

          <span className="h-px flex-1 bg-[#e5dac6]" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => console.log("Google OAuth")}
          className="
            flex
            h-[50px]
            w-full
            items-center
            justify-center
            gap-3
            rounded-[11px]
            border
            border-[#dfd2bc]
            bg-[#fffdf9]
            px-4
            text-[14px]
            font-semibold
            text-[#17130f]
            transition-all
            hover:border-[#cdbb9d]
            hover:bg-[#faf5eb]
          "
        >
          <span className="text-[17px] font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>
      </form>
    </>
  );
};

export default LoginForm;
