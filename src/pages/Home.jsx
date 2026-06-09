import API_URL from "../config";
import { Link } from "react-router-dom"
import { useEffect } from "react"



function Home() {
  const user = JSON.parse(localStorage.getItem("user"))
  
   useEffect(() => {
    const user = localStorage.getItem("user")

    if (user) {
      console.log("Logged in user:", JSON.parse(user))
    } else {
      console.log("No user found")
    }
  }, [])

  useEffect(() => {
    fetch(`${API_URL}/`)
      .then(res => res.text())
      .then(data => console.log(data))
  }, [])
  
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">

      {/* Navbar */}

      <nav className="flex justify-between items-center px-8 py-5 border-b border-gray-800 backdrop-blur-lg">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500 bg-clip-text text-transparent">
          AI Study Assistant
        </h1>

        {user ? (
  <div className="flex gap-3 items-center">

    <p className="text-green-400">
      {user.email}
    </p>

    <button
      onClick={() => {
        localStorage.removeItem("user")
localStorage.removeItem("token")
window.location.reload()
      }}
      className="bg-red-500 px-3 py-1 rounded"
    >
      Logout
    </button>

  </div>
) : (
  <Link to="/login">
    <button className="bg-blue-500 px-4 py-2 rounded">
      Login
    </button>
  </Link>
)}

      </nav>

      {/* Hero Section */}

      <div className="flex flex-col items-center justify-center text-center px-6 mt-24">

        <p className="text-blue-400 mb-4 tracking-widest uppercase">
          Smart AI Powered Learning
        </p>

        <h1 className="text-6xl font-extrabold leading-tight max-w-4xl bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent">
          Study Smarter <br />
          with Artificial Intelligence 🚀
        </h1>

        <p className="text-gray-400 text-xl mt-8 max-w-2xl leading-relaxed">
          Upload notes, generate summaries, create quizzes and boost your productivity using AI.
        </p>

        {/* Buttons */}

        <div className="flex gap-5 mt-10">

          <Link to="/login">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 hover:from-blue-600 hover:to-purple-600 transition duration-300 shadow-xl shadow-blue-500/20">
              Get Started
            </button>
          </Link>

          <button className="border border-gray-700 px-8 py-4 rounded-2xl text-lg hover:bg-gray-900 transition duration-300 hover:scale-105">
            Watch Demo
          </button>

        </div>

      </div>

      {/* Features Section */}

      <div className="grid md:grid-cols-3 gap-8 px-10 mt-28 pb-16">

        {/* Card 1 */}

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 hover:border-blue-500 shadow-lg">

          <div className="text-5xl mb-5">
            📄
          </div>

          <h2 className="text-2xl font-bold mb-3">
            AI Summaries
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Upload your notes or PDFs and get instant AI-generated summaries in seconds.
          </p>

        </div>

        {/* Card 2 */}

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 hover:border-purple-500 shadow-lg">

          <div className="text-5xl mb-5">
            🧠
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Smart Quiz
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Generate quizzes automatically and test your knowledge interactively.
          </p>

        </div>

        {/* Card 3 */}

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 hover:-translate-y-2 transition duration-300 hover:border-cyan-500 shadow-lg">

          <div className="text-5xl mb-5">
            ⚡
          </div>

          <h2 className="text-2xl font-bold mb-3">
            Productivity Boost
          </h2>

          <p className="text-gray-400 leading-relaxed">
            Stay focused with AI tools designed to improve your learning efficiency.
          </p>

        </div>

      </div>

    </div>
  )
}

export default Home
