import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
    const location = useLocation();
    const [activeStyle, setActiveStyle] = useState({ left: 0, width: 0 });
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [menuOpen, setMenuOpen] = useState(false);

    // 화면 크기 변경 감지
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 600);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 활성화된 메뉴 아이템에 따라 activeLine 위치 계산
    useEffect(() => {
        const navItems = Array.from(document.querySelectorAll('.nav-item'));
        const activeIndex = navItems.findIndex(
            (item) => item.firstChild.getAttribute('href') === location.pathname
        );

        if (activeIndex !== -1) {
            const activeItem = navItems[activeIndex];
            const { offsetLeft, offsetWidth } = activeItem;
            setActiveStyle({ left: offsetLeft, width: offsetWidth });
        }
    }, [location]);

    const toggleMenu = () => setMenuOpen(!menuOpen);

    return (
        <header style={styles.header}>
            <div style={styles.logo}>
                <Link to="/" style={styles.logoLink}>
                    K:DIY
                </Link>
            </div>

            {isMobile ? (
                <>
                    <div style={styles.menuIcon} onClick={toggleMenu}>
                        <div style={styles.hamburger}></div>
                        <div style={styles.hamburger}></div>
                        <div style={styles.hamburger}></div>
                    </div>
                    <div
                        style={{
                            ...styles.drawer,
                            transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
                        }}
                    >
                        <ul style={styles.drawerList}>
                            <li style={styles.drawerItem}>
                                <Link
                                    to="/"
                                    style={styles.drawerLink}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    메인
                                </Link>
                            </li>
                            <li style={styles.drawerItem}>
                                <Link
                                    to="/month"
                                    style={styles.drawerLink}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    예약하기
                                </Link>
                            </li>
                            <li style={styles.drawerItem}>
                                <Link
                                    to="/key"
                                    style={styles.drawerLink}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    열쇠 대여/반납
                                </Link>
                            </li>
                            <li style={styles.drawerItem}>
                                <Link
                                    to="/check"
                                    style={styles.drawerLink}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    예약 확인/수정
                                </Link>
                            </li>
                            <li style={styles.drawerItem}>
                                <Link
                                    to="/help"
                                    style={styles.drawerLink}
                                    onClick={() => setMenuOpen(false)}
                                >
                                    이용 안내
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {menuOpen && (
                        <div
                            style={styles.overlay}
                            onClick={() => setMenuOpen(false)}
                        ></div>
                    )}
                </>
            ) : (
                <nav style={styles.nav}>
                    <ul style={styles.navList}>
                        <li className="nav-item" style={styles.navItem}>
                            <Link to="/" style={styles.navLink}>
                                메인
                            </Link>
                        </li>
                        <li className="nav-item" style={styles.navItem}>
                            <Link to="/month" style={styles.navLink}>
                                예약하기
                            </Link>
                        </li>
                        <li className="nav-item" style={styles.navItem}>
                            <Link to="/key" style={styles.navLink}>
                                열쇠 대여/반납
                            </Link>
                        </li>
                        <li className="nav-item" style={styles.navItem}>
                            <Link to="/check" style={styles.navLink}>
                                예약 확인/수정
                            </Link>
                        </li>
                        <li className="nav-item" style={styles.navItem}>
                            <Link to="/help" style={styles.navLink}>
                                이용 안내
                            </Link>
                        </li>
                    </ul>
                </nav>
            )}
        </header>
    );
};

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 25px',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: 'white',
        position: 'fixed',
        width: '100%',
        zIndex: 1000,
    },
    logo: {
        fontSize: '28px',
        fontWeight: 'bold',
    },
    menuIcon: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        cursor: 'pointer',
    },
    hamburger: {
        width: '30px',
        height: '3px',
        backgroundColor: 'white',
    },
    drawer: {
        position: 'fixed',
        top: 0,
        right: 0,
        width: '300px',
        height: '100%',
        backgroundColor: '#fff', // 배경색 흰색
        color: '#000', // 글자색 검정
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // 위쪽 정렬
        paddingTop: '100px', // 로고 아래 여백 확보
        paddingRight: '20px',
        paddingLeft: '20px', 
        boxShadow: '-2px 0 6px rgba(0, 0, 0, 0.3)',
        transition: 'transform 0.3s ease',
        zIndex: 1500,
    },
    drawerList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        textAlign: 'right', 
    },
    drawerItem: {
        marginBottom: '20px',
        paddingBottom: '10px',
        borderBottom: '1px solid rgba(0, 0, 0, 0.1)', // 구분선 색 옅게 설정
    },
    drawerLink: {
        color: '#000', // 글자색 검정
        textDecoration: 'none',
        fontSize: '18px',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        zIndex: 1400,
    },
    nav: {
        display: 'flex',
    },
    navList: {
        listStyle: 'none',
        display: 'flex',
        gap: '20px',
        padding: 0,
        margin: 0,
    },
    navItem: {},
    navLink: {
        color: 'white',
        textDecoration: 'none',
    },
};

export default Header;