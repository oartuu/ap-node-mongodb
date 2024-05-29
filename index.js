const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 5000;

// Conexão com o MongoDB
mongoose.connect('mongodb://localhost:27017/mobileApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado ao MongoDB'))
.catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definindo o schema do usuário
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  cep: String,
  state: String,
  city: String,
  neighborhood: String,
  street: String,
  number: String
});

// Modelo do usuário
const User = mongoose.model('User', userSchema);

// Middleware para analisar corpos de requisição
app.use(bodyParser.json());

// Rota de registro de usuário
app.post('/register', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send({ message: 'Usuário cadastrado com sucesso' });
  } catch (error) {
    res.status(500).send({ error: 'Erro no servidor' });
  }
});

// Rota de login
app.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ error: 'Usuário não encontrado' });
      }
      if (password !== user.password) { // Comparação direta das senhas em texto plano
        return res.status(400).send({ error: 'Senha incorreta' });
      }
      res.send({ message: 'Login bem sucedido' });
    } catch (error) {
      res.status(500).send({ error: 'Erro no servidor' });
    }
});
  
app.get('/', (req, res) => {
    res.send('Hello World!');
  });

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
