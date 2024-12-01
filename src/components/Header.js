import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const [activeStyle, setActiveStyle] = useState({ left: 0, width: 0 });
    const navRef = useRef(null);

    useEffect(() => {
        const navItems = Array.from(navRef.current?.children || []);
        const activeIndex = navItems.findIndex(
            (item) => item.firstChild.getAttribute('href') === location.pathname
        );

        if (activeIndex !== -1) {
            const activeItem = navItems[activeIndex];
            const { offsetLeft, offsetWidth } = activeItem;
            setActiveStyle({ left: offsetLeft, width: offsetWidth });
        }
    }, [location]);

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoLink}>K:DIY</Link>
            </div>

            <nav style={styles.nav}>
                <ul ref={navRef} style={styles.navList}>
                    <li style={styles.navItem}>
                        <Link to="/" style={styles.navLink}>메인</Link>
                    </li>
                    <li style={styles.navItem}>
                        <Link to="/month" style={styles.navLink}>예약하기</Link>
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
                <div
                    style={{
                        ...styles.activeLine,
                        left: activeStyle.left,
                        width: activeStyle.width,
                    }}
                />
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
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: '1000',
    },
    logo: {
        fontSize: '30px',
        fontWeight: '700',
    },
    nav: {
        position: 'relative',
    },
    navList: {
        display: 'flex',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        gap: '30px',
        position: 'relative',

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
        height: '2px',
        backgroundColor: '#fff',
        transition: 'all 0.3s ease',
    },
};

export default Header;
