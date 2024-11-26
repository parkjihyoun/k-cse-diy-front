import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
const Layout = () => {
    return (
        <div style={styles.layout}>
            <Header />
            <main style={styles.main}>
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
        background: 'rgba(0, 0, 0, 0.5)', // Optional: 페이지 배경 조정
    },
    main: {
        flex: 1, // 메인 영역이 화면의 대부분 차지
        padding: '20px',
    },
};

export default Layout;