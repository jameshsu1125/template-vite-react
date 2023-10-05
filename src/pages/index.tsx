import React from 'react';
import ReactDOM from 'react-dom/client';

const App = () => {
	return <div className='text-5xl text-sky-500'>index2</div>;
};

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
