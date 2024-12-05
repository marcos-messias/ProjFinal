const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importando o CORS

// Criando a aplicação Express
const app = express();

// Usando o middleware CORS
app.use(cors()); // Permite requisições de qualquer origem

// Usando body-parser para lidar com JSON e dados codificados em URL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração de conexão com o banco de dados MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'eventos'
});

// Conectar ao banco de dados
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados');
});



// Rota POST para cadastrar um evento
app.post('/evento', (req, res) => {
  const { nome_evento, descricao_evento, data_inicio_evento, data_fim_evento, local_evento } = req.body;

  if (!nome_evento || !descricao_evento || !data_inicio_evento || !data_fim_evento || !local_evento) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  const query = `INSERT INTO eventos (nome_evento, descricao_evento, data_inicio_evento, data_fim_evento, local_evento)
                 VALUES (?, ?, ?, ?, ?)`;

  connection.query(query, [nome_evento, descricao_evento, data_inicio_evento, data_fim_evento, local_evento], (err, results) => {
    if (err) {
      console.error('Erro ao inserir evento: ' + err.stack);
      return res.status(500).json({ message: 'Erro ao inserir evento' });
    }

    res.status(201).json({
      message: 'Evento inserido com sucesso',
      evento_id: results.insertId
    });
  });
});




// Rota DELETE para excluir um evento pelo ID
app.delete('/evento/:id', (req, res) => {
  const eventId = req.params.id;

  // Consulta SQL para excluir o evento
  const query = `DELETE FROM eventos WHERE id = ?`;

  // Executa a consulta SQL para excluir o evento
  connection.query(query, [eventId], (err, results) => {
      if (err) {
          console.error('Erro ao excluir evento:', err.stack);
          return res.status(500).json({ message: 'Erro ao excluir evento' });
      }

      if (results.affectedRows > 0) {
          res.status(200).json({ message: 'Evento excluído com sucesso' });
      } else {
          res.status(404).json({ message: 'Evento não encontrado' });
      }
  });
});





// Rota GET para listar todos os eventos
app.get('/eventos', (req, res) => {
  const query = 'SELECT * FROM eventos'; // Consulta SQL para buscar todos os eventos

  // Executa a consulta SQL
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar eventos: ' + err.stack);
      return res.status(500).json({ message: 'Erro ao buscar eventos' });
    }

    // Retorna os eventos encontrados no banco de dados
    res.status(200).json(results);
  });
});





// Iniciar o servidor na porta 3000
app.listen(3000, () => {
  console.log('Fununciando');
});
