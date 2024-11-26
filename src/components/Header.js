import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header style={styles.header}>
            <div style={styles.logo}>K:DIY</div>

            <nav style={styles.nav}>
                <ul style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/" style={styles.navLink}>메인</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/month" style={styles.navLink}>예약하기</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/week" style={styles.navLink}>주</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/key" style={styles.navLink}>열쇠 대여/반납</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/check" style={styles.navLink}>예약 확인/수정</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/help" style={styles.navLink}>이용 안내</Link>
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
        // backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    logo: {
        fontSize: '30px',
        fontWeight: '700',
    },

    nav: {
        
    },
    navList: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '30px',
    },
    navItem: {
        margin: 0,
    },
    navLink: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '15px',
        fontWeight: '500',
    },
    navLinkHover: {
        color: '#00aced',
    },
};

export default Header;