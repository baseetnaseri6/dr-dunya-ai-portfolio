import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const doctor = JSON.parse(fs.readFileSync("./server/doctor-data.json", "utf8"));

function makePrompt(message) {
  return `
You are the AI assistant for Dr. Dunya Naseri's medical portfolio.

Use only this profile information:
${JSON.stringify(doctor, null, 2)}

User question:
${message}

Answer shortly, professionally, and in a medical portfolio tone.
Do not invent hospital phone numbers, fake addresses, or fake medical claims.
`;
}

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message || "";

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        prompt: makePrompt(message),
        stream: false
      })
    });

    const data = await response.json();

    res.json({
      answer: data.response || "I could not generate a response."
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      answer: "AI server is offline. Please start Ollama and the local server."
    });
  }
});

app.post("/api/chat-stream", async (req, res) => {
  try {
    const message = req.body.message || "";

    const ollama = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.1",
        prompt: makePrompt(message),
        stream: true
      })
    });

    res.setHeader("Content-Type", "text/plain; charset=utf-8");

    const reader = ollama.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.trim()) continue;

        try {
          const data = JSON.parse(line);
          if (data.response) {
            res.write(data.response);
          }
        } catch {
          continue;
        }
      }
    }

    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).send("AI server is offline. Please start Ollama and the local server.");
  }
});

app.listen(PORT, () => {
  console.log(`AI server running on http://localhost:${PORT}`);
});
