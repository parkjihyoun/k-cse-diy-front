import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {
    return (
        <nav style={styles.nav}>
            <ul style={styles.navList}>
                <li style={styles.navItem}>
                    <Link to="/" style={styles.navLink}>Main</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/key" style={styles.navLink}>Key Page</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/month" style={styles.navLink}>Month Page</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/week" style={styles.navLink}>Week Page</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/help" style={styles.navLink}>Help Page</Link>
                </li>
                <li style={styles.navItem}>
                    <Link to="/check" style={styles.navLink}>Check Page</Link>
                </li>
            </ul>
        </nav>
    );
};

const styles = {
    nav: {
        backgroundColor: '#333333',
        width:'100%',
        paddingTop: '40px',
    },
    navList: {
        listStyle: 'none',
        display: 'flex',
        margin: 0,
        padding: 0,
    },
    navItem: {
        margin: '0 10px',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
    },
};

export default Navigation;