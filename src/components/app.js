import { Router } from 'preact-router';

// Code-splitting is automated for `routes` directory
import Home from '../routes/home';

const App = () => (
	<div id="app">
		<main>
			<Router>
				<Home path="/" />
			</Router>
		</main>
	</div>
);

export default App;
