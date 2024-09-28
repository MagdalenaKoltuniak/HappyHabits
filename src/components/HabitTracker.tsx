import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/HabitTracker.css';

interface Habit {
	id: number;
	tresc: string;
}

const HabitTracker: React.FC = () => {
	const [habits, setHabits] = useState<Habit[]>([]);
	const [newHabit, setNewHabit] = useState('');
	const [editingId, setEditingId] = useState<number | null>(null);
	const [editedText, setEditedText] = useState('');

	useEffect(() => {
		fetchHabits();
	}, []);

	const fetchHabits = async () => {
		try {
			const response = await axios.get<{ teksty: Habit[] }>('http://localhost:5000/api/tekst');
			setHabits(response.data.teksty);
		} catch (error) {
			console.error('Błąd podczas pobierania nawyków:', error);
		}
	};

	const handleAddHabit = async () => {
		if (!newHabit.trim()) return;
		try {
			await axios.post('http://localhost:5000/api/dodaj-tekst', { tresc: newHabit });
			setNewHabit('');
			fetchHabits();
		} catch (error) {
			console.error('Błąd podczas dodawania nawyku:', error);
		}
	};

	const handleEdit = (id: number, tresc: string) => {
		setEditingId(id);
		setEditedText(tresc);
	};

	const handleSave = async (id: number) => {
		try {
			await axios.put(`http://localhost:5000/api/aktualizuj-tekst/${id}`, { tresc: editedText });
			setEditingId(null);
			fetchHabits();
		} catch (error) {
			console.error('Błąd podczas aktualizacji nawyku:', error);
		}
	};

	const handleDelete = async (id: number) => {
		if (window.confirm('Czy na pewno chcesz usunąć ten nawyk?')) {
			try {
				await axios.delete(`http://localhost:5000/api/usun-tekst/${id}`);
				fetchHabits();
			} catch (error) {
				console.error('Błąd podczas usuwania nawyku:', error);
			}
		}
	};

	return (
		<div className='app-container'>
			<header className='header'>
				<h1>Nawyki</h1>
				<div className='header-icons'>
					<span className='header-icon' onClick={handleAddHabit}>
						+
					</span>
					<span className='header-icon'>≡</span>
					<span className='header-icon'>⋮</span>
				</div>
			</header>
			<div className='date-header'>
				<div className='date-item'>
					CZW.
					<br />
					26
				</div>
				<div className='date-item'>
					PT.
					<br />
					27
				</div>
				<div className='date-item'>
					SOB.
					<br />
					28
				</div>
			</div>
			<ul className='habit-list'>
				{habits.map(habit => (
					<li key={habit.id} className='habit-item'>
						<div className='habit-actions'>
							<span className='habit-icon' onClick={() => handleEdit(habit.id, habit.tresc)}>
								✎
							</span>
							<span className='habit-icon' onClick={() => handleDelete(habit.id)}>
								🗑
							</span>
						</div>
						{editingId === habit.id ? (
							<input
								value={editedText}
								onChange={e => setEditedText(e.target.value)}
								onBlur={() => handleSave(habit.id)}
							/>
						) : (
							<span className='habit-name'>{habit.tresc}</span>
						)}
						<div className='habit-status'>
							<span className='status-mark'>?</span>
							<span className='status-mark'>?</span>
							<span className='status-mark'>?</span>
						</div>
					</li>
				))}
			</ul>
			<div className='add-habit'>
				<input
					type='text'
					value={newHabit}
					onChange={e => setNewHabit(e.target.value)}
					placeholder='Dodaj nowy nawyk'
				/>
				<button onClick={handleAddHabit}>Dodaj</button>
			</div>
		</div>
	);
};

export default HabitTracker;
