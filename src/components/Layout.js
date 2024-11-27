import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();

    const titles = {
        '/key': '예약 확인',
        '/month': '소개',
        '/check': '예약 확인',
        '/check/list': '예약 리스트',
    };

    const currentTitle = titles[location.pathname] || '페이지';

    // MainPage 경로 지정
    const isMainPage = location.pathname === '/';

    return (
        <div style={styles.layout}>
            <Header />
            <main style={styles.main}>
                {/* MainPage가 아닌 경우 타이틀과 구분선 렌더링 */}
                {!isMainPage && (
                    <div style={styles.titleWrapper}>
                        <div style={styles.title}>{currentTitle}</div>
                        <div style={styles.line}></div>
                    </div>
                )}
                {/* 현재 라우트의 페이지를 렌더링 */}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

const styles = {
    layout: {
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'rgba(0, 0, 0, 0.6)',
    },
    main: {
        flex: 1,
        padding: '40px',
        marginTop:'96px',
        marginTop: '96px',
    },
    titleWrapper: {
        marginBottom: '20px',
    },
    title: {
        fontFamily: 'Inter, sans-serif',
        color: 'white',
        fontSize: '25px',
        fontWeight: 'bold',
    },
    line: {
        width: '50px',
        height: '4px',
        backgroundColor: 'white',
        marginTop: '10px',
    },
};

export default Layout;
