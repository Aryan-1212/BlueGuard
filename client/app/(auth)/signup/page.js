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
const FcGoogle = dynamic(() => import("react-icons/fc").then(mod => mod.FcGoogle), { ssr: false });

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem("token")) {
      router.push("/dashboard2");
    }
  }, [router]);

  if (!mounted) return null;  // prevent hydration mismatch

  const handleSignup = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    alert(data.message || "User created!");
    if (res.status === 200) {
      router.push("/login");
    }
  };

  return (
    <AuthRedirect>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Account 🚀
        </h1>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
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

          <button
            type="submit"
            className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Signup
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
