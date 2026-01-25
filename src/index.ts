import express from "express"
import { parseConfig } from "./config.js"

const startServer = () => {
  const config = parseConfig()
  const app = express()

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" })
  })

  app.listen(config.port, () => {})
}

startServer()
