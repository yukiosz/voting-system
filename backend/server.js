const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const pendingConfirmations = {};

console.log("Servidor iniciando...");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "emailSender",
    pass: "appPass"
  }
});

app.post("/send-confirmation", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send({ success: false, message: "Email é obrigatório" });

  const token = crypto.randomBytes(20).toString("hex");
  pendingConfirmations[token] = email;

  try {
    await transporter.sendMail({
      from: "Sistema de Votação <seuemail@gmail.com>",
      to: email,
      subject: "Confirme seu voto",
      text: `Token para verificação: ${token}`
    });

    res.send({ success: true, message: "Email de confirmação enviado", token });
  } catch (err) {
    console.error("Erro ao enviar email:", err);
    res.status(500).send({ success: false, message: "Erro ao enviar email" });
  }
});

app.get("/confirm/:token", (req, res) => {
  const { token } = req.params;
  if (pendingConfirmations[token]) {
    const email = pendingConfirmations[token];
    delete pendingConfirmations[token];
    return res.send({ success: true, email });
  }
  return res.status(400).send({ success: false, message: "Token inválido ou expirado" });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});