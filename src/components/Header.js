import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoLink}>K:DIY</Link>
            </div>

            <nav style={styles.nav}>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/" style={styles.navLink}>
                            메인
                            {location.pathname === '/' && <div style={styles.activeLine}></div>}
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/month" style={styles.navLink}>
                            예약하기
                            {location.pathname === '/month' && <div style={styles.activeLine}></div>}
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/week" style={styles.navLink}>
                            주
                            {location.pathname === '/week' && <div style={styles.activeLine}></div>}
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/key" style={styles.navLink}>
                            열쇠 대여/반납
                            {location.pathname === '/key' && <div style={styles.activeLine}></div>}
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/check" style={styles.navLink}>
                            예약 확인/수정
                            {location.pathname === '/check' && <div style={styles.activeLine}></div>}
                        </Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/help" style={styles.navLink}>
                            이용 안내
                            {location.pathname === '/help' && <div style={styles.activeLine}></div>}
                        </Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        color: '#fff',
        position: 'fixed',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '30px 40px',
    },
    logo: {
        fontSize: '30px',
        fontWeight: '700',
    },

    nav: {},
    navList: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '30px',
    },
    navItem: {
        margin: 0,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: '500',
    },
    activeLine: {
        position: 'absolute',
        bottom: '-10px',
        width: '120%',
        height: '1px',
        backgroundColor: '#fff',
        left: '50%',
        transform: 'translateX(-50%)',
    },
};


export default Header;
