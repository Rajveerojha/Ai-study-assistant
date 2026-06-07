const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {

  try {

    const token = req.header("Authorization")

    if (!token) {
      return res.status(401).json({
        message: "No token"
      })
    }

    const decoded = jwt.verify(
      token,
      "mysecretkey"
    )

    req.userId = decoded.userId

    next()

  } catch (error) {

    res.status(401).json({
      message: "Invalid Token"
    })

  }

}

module.exports = auth