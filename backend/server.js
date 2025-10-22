const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
const bcrypt = require("bcrypt");
const mysql = require("mysql2/promise");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

const pendingConfirmations = {};

let db;

(async () => {
  try {
    db = await mysql.createConnection({
      host: "localhost",
      user: "nomeUser",
      password: "senhaUser",
      database: "nomeDB",
    });
    console.log("✅ Conectado ao MySQL");

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "emailSender",
        pass: "chaveSender",
      },
    });


    app.post("/registrar-eleitor", async (req, res) => {
      const { identificacao, nome, email, senha } = req.body;
      if (!identificacao || !nome || !email || !senha)
        return res
          .status(400)
          .send({ success: false, message: "Preencha todos os campos." });

      try {
        const senhaHash = await bcrypt.hash(senha, 10);

        await db.execute(
          "INSERT INTO eleitores (identificacao, nome, email, senha_hash) VALUES (?, ?, ?, ?)",
          [identificacao, nome, email, senhaHash]
        );

        res.send({ success: true, message: "Eleitor cadastrado com sucesso." });
      } catch (err) {
        console.error("Erro ao registrar eleitor:", err);
        res
          .status(500)
          .send({ success: false, message: "Erro ao registrar eleitor." });
      }
    });

    app.post("/verificar-eleitor", async (req, res) => {
      const { identificacao, email, senha } = req.body;

      if (!identificacao || !email || !senha)
        return res
          .status(400)
          .send({ success: false, message: "Preencha todos os campos." });

      try {
        const [rows] = await db.execute(
          "SELECT * FROM eleitores WHERE identificacao = ? AND email = ?",
          [identificacao, email]
        );

        if (rows.length === 0)
          return res
            .status(404)
            .send({ success: false, message: "Eleitor não encontrado." });

        const eleitor = rows[0];
        const senhaCorreta = await bcrypt.compare(senha, eleitor.senha_hash);

        if (!senhaCorreta)
          return res
            .status(401)
            .send({ success: false, message: "Senha incorreta." });

        const token = crypto.randomBytes(10).toString("hex");
        pendingConfirmations[token] = email;

        await transporter.sendMail({
          from: "Sistema de Votação <rafaelyukioshira@gmail.com>",
          to: email,
          subject: "Confirmação de voto",
          text: `Token para verificação: ${token}`,
        });

        res.send({ success: true, message: "Token enviado para o email." });
      } catch (err) {
        console.error("Erro ao verificar eleitor:", err);
        res.status(500).send({ success: false, message: "Erro no servidor." });
      }
    });

    app.get("/confirm/:token", (req, res) => {
      const { token } = req.params;
      if (pendingConfirmations[token]) {
        const email = pendingConfirmations[token];
        delete pendingConfirmations[token];
        return res.send({ success: true, email });
      }
      return res
        .status(400)
        .send({ success: false, message: "Token inválido ou expirado." });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erro ao inicializar o servidor:", error);
  }
})();
