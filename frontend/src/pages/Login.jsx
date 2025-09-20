import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { LoaderIcon, MailIcon, MessageCircleIcon, UserIcon } from "lucide-react"
import { Link } from "react-router"
export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const { login, isLoggingIn } = useAuthStore()

  const handleSubmit = (e) => {
    e.preventDefault()
    login(formData)
  }
  return (
    <div className="w-full flex items-center justify-center p-4 bg-stone-900">
      <div className="relative w-full max-w-6xl md:h-[800px] h-[650px] bg-stone-800">
        <div className="w-full h-full flex overflow-hidden rounded-2xl border border-stone-500">
          <div className="w-full flex flex-col md:flex-row">
            {/* LEFT SIDE */}
            <div className="md:w-1/2 p-8 flex items-center justify-center md:border-r border-stone-600/30">
              <div className="w-full max-w-md">
                {/* HEADER */}
                <div className="text-center mb-8">
                  <MessageCircleIcon className="w-12 h-12 mx-auto text-stone-400 mb-4" />
                  <h2 className="text-2xl font-bold text-stone-200 mb-2">
                    Welcome Back
                  </h2>
                  <p className="text-stone-400"> Sign in to get started</p>
                </div>
                {/* FORM */}
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="fullName" className="auth-input-label">
                      Email
                    </label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="input"
                        placeholder="Enter email..."
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="fullName" className="auth-input-label">
                      Password
                    </label>
                    <div className="relative">
                      <MailIcon className="auth-input-icon" />
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        className="input"
                        placeholder="Enter password..."
                      />
                    </div>
                  </div>
                  <button
                    className="auth-btn"
                    type="submit"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <LoaderIcon className="w-full h-5 animate-spin text-center" />
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </form>
                <div className="mt-6 text-center">
                  <Link to="/signup" className="auth-link">
                    Don't have an account? Sign up
                  </Link>
                </div>
              </div>
            </div>
            {/* RIGHT SIDE */}
            <div className="hidden md:w-1/2 md:flex items-center justify-center p-6 bg-gradient-to-bl from-stone-800/20 to-transparent">
              <div>
                <img
                  src="/login.png"
                  alt="Signup"
                  className="w-full h-auto object-contain"
                />
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-medium text-stone-400">
                    Connect anytime, anywhere
                  </h3>
                  <div className="mt-4 flex justify-center gap-4">
                    <span className="auth-badge">Free</span>
                    <span className="auth-badge">Easy Setup</span>
                    <span className="auth-badge">Private</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
