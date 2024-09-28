const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'hackaton_test',
});

app.get('/api/tekst', (req, res) => {
	connection.query('SELECT * FROM teksty', (error, results) => {
		if (error) {
			res.status(500).json({ error: 'Błąd serwera' });
		} else {
			res.json({ teksty: results });
		}
	});
});

// Nowy endpoint do dodawania tekstu
app.post('/api/dodaj-tekst', (req, res) => {
	const { tresc } = req.body;
	if (!tresc) {
		return res.status(400).json({ error: 'Treść jest wymagana' });
	}

	const query = 'INSERT INTO teksty (tresc) VALUES (?)';
	connection.query(query, [tresc], (error, results) => {
		if (error) {
			res.status(500).json({ error: 'Błąd podczas dodawania tekstu' });
		} else {
			res.status(201).json({ message: 'Tekst dodany pomyślnie', id: results.insertId });
		}
	});
});

app.put('/api/aktualizuj-tekst/:id', (req, res) => {
	const { id } = req.params;
	const { tresc } = req.body;

	if (!tresc) {
		return res.status(400).json({ error: 'Treść jest wymagana' });
	}

	const query = 'UPDATE teksty SET tresc = ? WHERE id = ?';
	connection.query(query, [tresc, id], (error, results) => {
		if (error) {
			res.status(500).json({ error: 'Błąd podczas aktualizacji tekstu' });
		} else if (results.affectedRows === 0) {
			res.status(404).json({ error: 'Nie znaleziono tekstu o podanym ID' });
		} else {
			res.status(200).json({ message: 'Tekst zaktualizowany pomyślnie' });
		}
	});
});

app.delete('/api/usun-tekst/:id', (req, res) => {
	const { id } = req.params;

	const query = 'DELETE FROM teksty WHERE id = ?';
	connection.query(query, [id], (error, results) => {
		if (error) {
			res.status(500).json({ error: 'Błąd podczas usuwania tekstu' });
		} else if (results.affectedRows === 0) {
			res.status(404).json({ error: 'Nie znaleziono tekstu o podanym ID' });
		} else {
			res.status(200).json({ message: 'Tekst usunięty pomyślnie' });
		}
	});
});

const PORT = 5000;
app.listen(PORT, () => {
	console.log(`Serwer działa na porcie ${PORT}`);
});

// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');

// // Konfiguracja połączenia z bazą danych PostgreSQL
// const pool = new Pool({
// 	user: 'root', // Twój użytkownik PostgreSQL
// 	host: 'localhost', // Host
// 	database: 'hackaton_test', // Nazwa bazy danych
// 	password: '', // Hasło
// 	//   port: 5432,         // Domyślny port PostgreSQL
// });

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Pobieranie wszystkich nawyków
// app.get('/habits', async (req, res) => {
// 	const habits = await pool.query('SELECT * FROM habits');
// 	res.json(habits.rows);
// });

// // Dodawanie nowego nawyku
// app.post('/habits', async (req, res) => {
// 	const { name, days } = req.body;
// 	const newHabit = await pool.query('INSERT INTO habits (name, days) VALUES ($1, $2) RETURNING ', [name, days]);
// 	res.json(newHabit.rows[0]);
// });

// // Aktualizacja statusu nawyku
// app.put('/habits/:id', async (req, res) => {
// 	const { id } = req.params;
// 	const { days } = req.body;
// 	const updatedHabit = await pool.query('UPDATE habits SET days = $1 WHERE id = $2 RETURNING', [days, id]);
// 	res.json(updatedHabit.rows[0]);
// });

// // Usuwanie nawyku
// app.delete('/habits/:id', async (req, res) => {
// 	const { id } = req.params;
// 	await pool.query('DELETE FROM habits WHERE id = $1', [id]);
// 	res.json({ message: 'Habit deleted successfully' });
// });

// app.listen(5000, () => {
// 	console.log('Server running on port 5000');
// });
