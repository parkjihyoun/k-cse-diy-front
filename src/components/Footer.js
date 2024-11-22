import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p>&copy; Footer </p>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#333',
        color: '#fff',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
    },
};

export default Footer;