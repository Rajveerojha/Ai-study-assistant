require("dotenv").config()

const pdf = require("pdf-parse")
const fs = require("fs")
const multer = require("multer")
const auth = require("./middleware/auth")
const Note = require("./models/Note")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")
const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const User = require("./models/User")

const {
  GoogleGenerativeAI
} = require("@google/generative-ai")

const axios = require("axios")


const app = express()




app.use(cors())
const storage = multer.diskStorage({

  destination: (req, file, cb) => {

    cb(null, "uploads")

  },

  filename: (req, file, cb) => {

    cb(
      null,
      Date.now() + "-" + file.originalname
    )

  }

})

const upload = multer({
  storage
})
app.use(express.json())
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected 🚀"))
  .catch((err) => console.log(err))

// Home Route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀")
})
app.post("/signup", async (req, res) => {

  try {

    const { email, password } = req.body

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("Hashed Password:", hashedPassword)
    const newUser = new User({
      email,
      password: hashedPassword
    })
    await newUser.save()

    res.status(201).json({
      message: "Signup successful"
    })

  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    })
  }

})

// Fake Users


// Login Route
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: "User not found ❌"
      })
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    )

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password ❌"
      })
    }

    const token = jwt.sign(
      {
        userId: user._id
      },
      "mysecretkey",
      {
        expiresIn: "1d"
      }
    )

    res.json({
      message: "Login Successful 🚀",
      token,
      user
    })

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    })

  }

})
// Notes 
app.post("/notes", auth, async (req, res) => {

  try {

    const { title } = req.body

    const newNote = new Note({
      title,
      userId: req.userId
    })

    await newNote.save()

    res.status(201).json({
      message: "Note Saved",
      note: newNote
    })

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    })

  }

})
app.get("/notes", auth, async (req, res) => {

  try {

    const notes = await Note.find({
      userId: req.userId
    })

    res.json(notes)

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    })

  }

})
app.delete("/notes/:id", auth, async (req, res) => {

  try {

    await Note.findByIdAndDelete(req.params.id)

    res.json({
      message: "Note Deleted"
    })

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    })

  }

})
app.put("/notes/:id", auth, async (req, res) => {

  try {

    const { title } = req.body

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title
      },
      {
        new: true
      }
    )

    res.json({
      message: "Note Updated",
      note: updatedNote
    })

  } catch (error) {

    res.status(500).json({
      message: "Server Error"
    })

  }

})
app.post(
  "/upload",
  auth,
  upload.single("pdf"),
  async (req, res) => {

    try {

      const dataBuffer = fs.readFileSync(
        req.file.path
      )

      let pdfText = ""

      try {

        const pdfData = await pdf(dataBuffer)

        pdfText = pdfData.text

      } catch (err) {

        return res.status(400).json({
          message: "PDF Read Failed ❌"
        })

      }

      const axios = require("axios")

      const aiResponse = await axios.post(

        "https://openrouter.ai/api/v1/chat/completions",

        {
        model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content:
                `Create 5 quiz questions from these notes:

${pdfText}

Format:
1. Question
A) ...
B) ...
C) ...
D) ...
Answer: ...`
            }
          ]
        },

        {
          headers: {
            Authorization:
              `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      )
      const summaryResponse = await axios.post(

  "https://openrouter.ai/api/v1/chat/completions",

  {
    model: "openai/gpt-3.5-turbo",
    

    messages: [
      {
        role: "user",

        content:
          `Summarize these notes in simple points:

${pdfText}`
      }
    ]
  },

  {
    headers: {
      Authorization:
        `Bearer ${process.env.OPENROUTER_API_KEY}`,

      "Content-Type": "application/json"
    }
  }
)

const summary =
  summaryResponse.data.choices[0]
    .message.content



const flashcardResponse = await axios.post(

  "https://openrouter.ai/api/v1/chat/completions",

  {
    model: "openai/gpt-3.5-turbo",

    messages: [
      {
        role: "user",

        content:
          `Create 5 flashcards from these notes.

Format:
Q: question
A: answer

Notes:
${pdfText}`
      }
    ]
  },

  {
    headers: {
      Authorization:
        `Bearer ${process.env.OPENROUTER_API_KEY}`,

      "Content-Type": "application/json"
    }
  }
)

const flashcards =
  flashcardResponse.data.choices[0]
    .message.content

      const quiz =
        aiResponse.data.choices[0]
        .message.content

     return res.json({

  message:
    "AI Study Material Generated 🚀",

  summary,

  quiz,

  flashcards,

  pdfText
})
    } catch (error) {

      console.log(
        error.response?.data || error.message
      )

      return res.status(500).json({
        message: "Server Error"
      })

    }

  }
)
app.post(
  "/ask-ai",
  auth,
  async (req, res) => {

    try {

      const {
        question,
        pdfText
      } = req.body

      const axios = require("axios")

      const aiResponse =
        await axios.post(

          "https://openrouter.ai/api/v1/chat/completions",

          {

            model:
              "openai/gpt-3.5-turbo",

            messages: [
              {
                role: "user",

                content:
`Answer this question from the notes.

Notes:
${pdfText}

Question:
${question}`
              }
            ]

          },

          {
            headers: {

              Authorization:
                `Bearer ${process.env.OPENROUTER_API_KEY}`,

              "Content-Type":
                "application/json"

            }
          }

        )

      const answer =
        aiResponse.data
          .choices[0]
          .message.content

      return res.json({
        answer
      })

    } catch (error) {

      console.log(
        error.response?.data
        || error.message
      )

      return res.status(500).json({
        message: "Server Error"
      })

    }

  }
)

app.listen(5000, () => {
  console.log("Server running on port 5000")
})