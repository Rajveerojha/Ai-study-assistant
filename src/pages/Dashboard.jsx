import API_URL from "../config";
import { useNavigate } from "react-router-dom"
import "./Dashboard.css"
import { useEffect, useState } from "react"



function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "null")
  const token = localStorage.getItem("token")
  const [notes, setNotes] = useState([])
  const [title, setTitle] = useState("")
  const [editingId, setEditingId] = useState(null)
  const navigate = useNavigate()
  const [editTitle, setEditTitle] = useState("")
  const [pdf, setPdf] = useState(null)

  const [summary, setSummary] = useState("")
  const [quiz, setQuiz] = useState("")
  const [flashcards, setFlashcards] = useState("")
  const addNote = async () => {

    if (!title.trim()) return

    const res = await fetch(`${API_URL}/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({
        title
      })
    })

    const data = await res.json()

    if (res.ok) {

      setNotes([...notes, data.note])

      setTitle("")

    }

  }
  const deleteNote = async (id) => {

    const res = await fetch(
  `${API_URL}/notes/${id}`,
  {
    method: "DELETE",
    headers: {
      Authorization: token
    }
  }
)

    if (res.ok) {

      setNotes(
        notes.filter((note) => note._id !== id)
      )

    }

  }
  const editNote = async (id) => {

    const res = await fetch(
      `${API_URL}/notes/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        },
        body: JSON.stringify({
          title: editTitle
        })
      }
    )

    const data = await res.json()

    if (res.ok) {

      setNotes(
        notes.map((note) =>
          note._id === id ? data.note : note
        )
      )

      setEditingId(null)
      setEditTitle("")

    }

  }
  const uploadPdf = async () => {

    if (!pdf) return

    const formData = new FormData()

    formData.append("pdf", pdf)

    const res = await fetch(
      `${API_URL}/upload`,
      {
        method: "POST",
        headers: {
          Authorization: token
        },
        body: formData
      }
    )

    const data = await res.json()

if (res.ok) {

  localStorage.setItem(
    "summary",
    data.summary
  )

  localStorage.setItem(
    "quiz",
    data.quiz
  )

  localStorage.setItem(
    "flashcards",
    data.flashcards
  )

  localStorage.setItem(
  "pdfText",
  data.pdfText
)

  navigate("/study-material")

}

  }
  useEffect(() => {
    fetch(`${API_URL}/notes`, {
      headers: {
        Authorization: token
      }
    })
      .then((res) => res.json())
      .then((data) => {
        setNotes(data)
      })

  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-blue-950 text-white overflow-hidden">

      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/20 blur-[150px] rounded-full"></div>
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-purple-500/20 blur-[150px] rounded-full"></div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10 px-8 py-5 flex justify-between items-center">

        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
          AI Study Assistant
        </h1>

        <div className="flex items-center gap-4">

          <div className="hidden md:block text-green-400">
            {user?.email}
          </div>

          <button
            onClick={() => {
              localStorage.removeItem("user")
              localStorage.removeItem("token")
              window.location.href = "/login"
            }}
            className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10 relative z-10">

        {/* Hero Section */}
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 mb-10 shadow-2xl">

          <p className="uppercase tracking-widest text-cyan-400 mb-3">
            AI Powered Dashboard
          </p>

          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-4 bg-gradient-to-r from-white via-blue-200 to-purple-400 bg-clip-text text-transparent">
            Welcome Back 🚀
          </h1>

          <p className="text-gray-300 text-lg md:text-xl">
            Manage notes, generate quizzes and boost your learning with Artificial Intelligence.
          </p>

        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition duration-300 shadow-[0_0_30px_rgba(59,130,246,0.15)]">

            <div className="text-5xl mb-4">📄</div>

            <h2 className="text-3xl font-bold">
              {notes.length}
            </h2>

            <p className="text-gray-400 mt-2">
              Notes Uploaded
            </p>

          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition duration-300 shadow-[0_0_30px_rgba(168,85,247,0.15)]">

            <div className="text-5xl mb-4">🧠</div>

            <h2 className="text-3xl font-bold">0</h2>

            <p className="text-gray-400 mt-2">
              Quizzes Generated
            </p>

          </div>

          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8 hover:scale-105 transition duration-300 shadow-[0_0_30px_rgba(34,211,238,0.15)]">

            <div className="text-5xl mb-4">⚡</div>

            <h2 className="text-3xl font-bold">0</h2>

            <p className="text-gray-400 mt-2">
              AI Summaries
            </p>

          </div>

        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-8">

          {/* Upload Card */}
          <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-8">

            <h2 className="text-3xl font-bold mb-4">
              Upload Notes 🚀
            </h2>

            <p className="text-gray-400 mb-6">
              Upload PDFs, Notes and Documents to generate AI summaries.
            </p>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Enter Note Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10 outline-none"
              />
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setPdf(e.target.files[0])}
                className="w-full p-4 rounded-2xl bg-black/30 border border-white/10"
              />

              <button
                onClick={addNote}
                className="bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition"
              >
                Add Note
              </button>
              <button
                onClick={uploadPdf}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-105 transition"
              >
                Upload PDF
              </button>

            </div>

          </div>

          {/* Activity Card */}
          <div className="space-y-3">

            {notes.map((note) => (

              <div
                key={note._id}
                className="bg-white/5 p-4 rounded-xl flex justify-between items-center"
              >

                {editingId === note._id ? (

                  <div className="flex gap-3 w-full">

                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-black/30 border border-white/10"
                    />

                    <button
                      onClick={() => editNote(note._id)}
                      className="bg-green-500 px-3 py-1 rounded-lg"
                    >
                      Save
                    </button>

                  </div>

                ) : (

                  <>

                    <span>
                      📄 {note.title}
                    </span>

                    <div className="flex gap-2">

                      <button
                        onClick={() => {
                          setEditingId(note._id)
                          setEditTitle(note.title)
                        }}
                        className="bg-blue-500 px-3 py-1 rounded-lg"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteNote(note._id)}
                        className="bg-red-500 px-3 py-1 rounded-lg"
                      >
                        Delete
                      </button>

                    </div>

                  </>

                )}

              </div>

            ))}

          </div>

        </div>

      </div>
      <div className="ai-output">

        <div className="card">
          <h2>AI Summary 🚀</h2>
          <p>{summary}</p>
        </div>

        <div className="card">
          <h2>Quiz 🧠</h2>
          <p>{quiz}</p>
        </div>

        <div className="card">
          <h2>Flashcards 🔥</h2>
          <p>{flashcards}</p>
        </div>

      </div>

    </div>


  )
}

export default Dashboard