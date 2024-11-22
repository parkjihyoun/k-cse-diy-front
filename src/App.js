import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import GlobalStyles from './styles/GlobalStyles';
import Header from './components/Header';
import Footer from './components/Footer';
import Navigation from './components/Navigation';

function App() {
    return (
        <Router>
            <GlobalStyles />
            <div className="App" style={styles.app}>
                {/* Header */}
                <Header />

                {/* Navigation */}
                <Navigation />

                {/* Main Content (Routes) */}
                <main style={styles.main}>
                    <AppRoutes />
                </main>

                {/* Footer */}
                <Footer />
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
        padding: '20px',
        paddingTop: '40px',
    },
};

export default App;