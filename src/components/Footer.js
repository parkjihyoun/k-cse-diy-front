import React from 'react';
import cselogo from '../img/cselogo.png';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <img src={cselogo} alt="cselogo" style={styles.cselogo} />
            <p>made by: @yeaey_oo | @unnhyo | @w.o_xna | @y___ch__</p>
        </footer>
    );
};

const styles = {
    footer: {
        backgroundColor: '#000',
        opacity: '0.6',
        color: '#fff',
        textAlign: 'center',
        bottom: 0,
        width: '100%',
        padding: '30px',
    },

    cselogo: {
        width: '50px',
        marginBottom: '20px'
    },
};

export default Footer;