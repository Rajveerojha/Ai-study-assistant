import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa"
function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
   
    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    const data = await res.json()
   if (res.ok) {

  localStorage.setItem(
    "user",
    JSON.stringify(data.user)
  )

  localStorage.setItem(
    "token",
    data.token
  )

  alert("Login Successful 🚀")
  navigate("/dashboard")
}
   else {
    alert(data.message)
  }
}
  
  return (

    <div className="min-h-screen bg-black flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
            Welcome Back 👋
          </h1>

          <p className="text-gray-300 text-lg">
            Continue your smart learning journey with AI 🚀
          </p>

        </div>

        <form className="space-y-5">

          <div>
            <label className="block text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-3 rounded-xl bg-gray-800 text-white outline-none border border-gray-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
            />
          </div>

          <div className="relative ">
            <label className="block text-gray-300 mb-2">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 pr-12 rounded-xl bg-gray-800 text-white outline-none border border-gray-700 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="flex justify-between items-center text-sm">

            <label className="flex items-center gap-2 text-gray-400">
              <input type="checkbox" />
              Remember me
            </label>

            <p className="text-blue-400 cursor-pointer hover:text-blue-300">
              Forgot Password?
            </p>

          </div>

          <button onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition duration-300 py-3 rounded-xl text-white font-semibold hover:scale-[1.02] shadow-lg shadow-blue-500/20"
          >
            Login
          </button>

        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-[1px] bg-gray-700"></div>
          <p className="text-gray-400 text-sm">OR</p>
          <div className="flex-1 h-[1px] bg-gray-700"></div>
        </div>

        <button className="w-full border border-gray-700 py-3 rounded-xl text-white hover:bg-gray-800 transition">
          Continue with Google
        </button>

        <p className="text-gray-400 text-center mt-6">
          Don’t have an account?

          <Link to="/signup">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent cursor-pointer ml-2 font-semibold">
              Sign Up
            </span>
          </Link>

        </p>

      </div>

    </div>
  )
}

export default Login