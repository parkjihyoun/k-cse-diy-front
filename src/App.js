import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import GlobalStyles from './styles/GlobalStyles';

function App() {
    return (
        <Router>
            <GlobalStyles />
            <div className="App" style={styles.app}>

                {/* Main Content (Routes) */}
                <main style={styles.main}>
                    <AppRoutes />
                </main>

            </div>
        </Router>
    );
}

const styles = {
    app: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
    },
    main: {
        flex: 1,
    },
};

export default App;