import React from 'react';
import logo from '../img/logo.png';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <img src={logo} alt="logo" />
            <p>made by: @yeaey_oo | @unnhyo | @w.o_xna | @y___ch__</p>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#212121',
        color: '#bbb',
        textAlign: 'center',
        bottom: 0,
        width: '100%',
        padding: '20px',
    },
};

export default Footer;