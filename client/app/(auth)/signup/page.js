"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import AuthRedirect from "../../components/AuthRedirect";

// ✅ dynamically import icons (prevent hydration mismatch)
const FiMail = dynamic(() => import("react-icons/fi").then(mod => mod.FiMail), { ssr: false });
const FiUser = dynamic(() => import("react-icons/fi").then(mod => mod.FiUser), { ssr: false });
const FiLock = dynamic(() => import("react-icons/fi").then(mod => mod.FiLock), { ssr: false });
const FiPhone = dynamic(() => import("react-icons/fi").then(mod => mod.FiPhone), { ssr: false });
const FcGoogle = dynamic(() => import("react-icons/fc").then(mod => mod.FcGoogle), { ssr: false });

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("token")) {
      router.push("/dashboard2");
    }
  }, [router]);

  if (!mounted) return null;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      newErrors.email = "Invalid email format.";
    }

    if (!number.trim()) {
      newErrors.number = "Phone number is required.";
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(number.replace(/\s/g, ''))) {
      newErrors.number = "Invalid phone number format.";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, number, password }),
      });

      const data = await res.json();
      // alert(data.message || "User created!");
      setMessage(data.message || "User created!");

      if (res.status === 200) {
        router.push("/login");
      }
    } catch (err) {
      console.error("Signup error:", err);
      // alert("Something went wrong. Please try again.");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthRedirect>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
          {message && <div className="text-blue-500 font-semibold text-center mb-4">{message}</div>}
          <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
            Create Account 🚀
          </h1>

          <form onSubmit={handleSignup} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center border rounded-lg px-3">
                <FiUser className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Name"
                  className="flex-1 p-3 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {errors.name && (
                <span className="text-sm text-red-500">{errors.name}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center border rounded-lg px-3">
                <FiMail className="text-gray-400" />
                <input
                  type="email"
                  placeholder="Email"
                  className="flex-1 p-3 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {errors.email && (
                <span className="text-sm text-red-500">{errors.email}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center border rounded-lg px-3">
                <FiPhone className="text-gray-400" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="flex-1 p-3 outline-none"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                />
              </div>
              {errors.number && (
                <span className="text-sm text-red-500">{errors.number}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center border rounded-lg px-3">
                <FiLock className="text-gray-400" />
                <input
                  type="password"
                  placeholder="Password"
                  className="flex-1 p-3 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {errors.password && (
                <span className="text-sm text-red-500">{errors.password}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`p-3 text-white rounded-lg transition ${
                isSubmitting ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isSubmitting ? "Signing up..." : "Signup"}
            </button>
          </form>

          <div className="mt-4">
            <button
              onClick={() =>
                (window.location.href = "http://localhost:5000/api/auth/google")
              }
              className="flex items-center justify-center gap-2 w-full p-3 border rounded-lg hover:bg-gray-50 transition"
            >
              <FcGoogle className="text-xl" />
              <span>Continue with Google</span>
            </button>

            <div className="text-center mt-4 text-blue-500 underline">
              <Link href={"/login"}>already a new user?</Link>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
}
