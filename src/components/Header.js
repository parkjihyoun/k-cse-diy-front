import React from 'react';

const Header = () => {
    return (
        <header style={styles.header}>
            <h1 style={styles.title}>Header</h1>
        </header>
    );
};

const styles = {
    header: {
        backgroundColor: '#333333',
        textAlign: 'center',
        color: '#fff',
        position: 'fixed',
    top:0,
    width:'100%',
    zIndex:1000,
    },
    title: {
        margin: 0,
        fontSize: '24px',
    },
};

export default Header;