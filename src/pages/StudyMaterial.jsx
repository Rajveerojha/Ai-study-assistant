import API_URL from "../config";
import "./Dashboard.css"
import { useState } from "react"

const StudyMaterial = () => {

  const summary =
    localStorage.getItem("summary")

  const quiz =
    localStorage.getItem("quiz")

  const flashcards =
    localStorage.getItem("flashcards")

  const [activeTab, setActiveTab] =
    useState("summary")

  const [question, setQuestion] =
    useState("")

  const [messages, setMessages] =
  useState([])

  const [loading, setLoading] =
  useState(false)


  const askQuestion = async () => {

    setLoading(true)

    const pdfText =
      localStorage.getItem("pdfText")

    const token =
      localStorage.getItem("token")

    const res = await fetch(
      `${API_URL}/ask-ai`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",

          Authorization: token
        },

        body: JSON.stringify({

          question,

          pdfText

        })

      }
    )

    const data = await res.json()

    setMessages([
  ...messages,

  {
    question,
    answer: data.answer
  }
])
setMessages([

  ...messages,

  {
    question,

    answer: data.answer
  }

])

setLoading(false)

  }

  return (

    <div className="ai-output">

      <div className="tabs">

        <button
          onClick={() =>
            setActiveTab("summary")
          }
        >
          Summary
        </button>

        <button
          onClick={() =>
            setActiveTab("quiz")
          }
        >
          Quiz
        </button>

        <button
          onClick={() =>
            setActiveTab("flashcards")
          }
        >
          Flashcards
        </button>

        <button
          onClick={() =>
            setActiveTab("chat")
          }
        >
          Chat
        </button>

      </div>

      {
        activeTab === "summary" && (

          <div className="card">

            <h2>AI Summary 🚀</h2>

            <pre>{summary}</pre>

          </div>

        )
      }

      {
        activeTab === "quiz" && (

          <div className="card">

            <h2>Quiz 🧠</h2>

            <pre>{quiz}</pre>

          </div>

        )
      }

      {
        activeTab === "flashcards" && (

          <div className="card">

            <h2>Flashcards 🔥</h2>

            <pre>{flashcards}</pre>

          </div>

        )
      }

      {
        activeTab === "chat" && (

          <div className="card">

            <h2>Chat With PDF 🤖</h2>

            <input
              type="text"
              placeholder="Ask anything..."
              value={question}
              onChange={(e) =>
                setQuestion(e.target.value)
              }
            />

            <button
              onClick={askQuestion}
            >
              Ask AI
            </button>

            {
  loading && (

    <div className="thinking">

      AI Thinking...

    </div>

  )
}

            {
  messages.map((msg, index) => (

    <div
      key={index}
      className="chat-box"
    >

      <div className="user-msg">

        <strong>You:</strong>

        <p>{msg.question}</p>

      </div>

      <div className="ai-msg">

        <strong>AI:</strong>

        <p>{msg.answer}</p>

      </div>

    </div>

  ))
}

          </div>

        )
      }

    </div>

  )

}

export default StudyMaterial