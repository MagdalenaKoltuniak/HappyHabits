// import { useState } from 'react';
import './App.css';
import HabitTracker from './components/HabitTracker';
// import { AddHabit } from './components/AddHabit';
// import AppTest from './AppTest';
// import { TekstZBazy } from './components/Baza';

const App: React.FC = () => {
	// NOWE: Dodano stan do wyzwalania odświeżenia listy
	// const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

	// const handleAddOrUpdateSuccess = () => {
	// 	setRefreshTrigger(prev => prev + 1);
	// };

	return (
		<div className='App'>
			<h1>Moja aplikacja do zarządzania tekstami</h1>
			<HabitTracker />
			{/* <AddHabit onAddSuccess={handleAddOrUpdateSuccess} />
			<TekstZBazy refreshTrigger={refreshTrigger} /> */}
		</div>
	);
};

export { App };
