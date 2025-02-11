import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import AdminHeader from './AdminHeader'; // 추가: 관리자 전용 헤더
import Footer from './Footer';
import styles from '../styles/Layout.module.css';

const Layout = () => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 770);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const titles = {
        '/key': '예약 확인',
        '/month': '실시간 예약 현황',
        '/week': '실시간 예약 현황',
        '/check': '예약 확인',
        '/check/list': '예약 리스트',
        '/help': '이용 안내',
        '/help/rule': '이용 규칙',
        '/help/tutorial': '예약 방법 및 FAQ',
        '/admin': '관리자 로그인',
        '/admin/month': '관리자용 월별 예약 처리',
        '/admin/week': '관리자용 주간 예약 처리',
    };

    const currentTitle = titles[location.pathname] || '페이지';
    const isMainPage = location.pathname === '/';
    const isAdminRoute = location.pathname.startsWith('/admin'); // 관리자 페이지 여부 확인

    return (
        <div className={styles.layout}>
            {isAdminRoute ? <AdminHeader /> : <Header />} {/* 관리자일 경우 AdminHeader 사용 */}
            <main className={styles.main}>
                {!isMainPage && (
                    <div
                        className={`${styles.titleWrapper} ${
                            isMobile ? styles.titleWrapperMobile : ''
                        }`}
                    >
                        <div className={`${styles.title} ${isMobile ? styles.titleMobile : ''}`}>
                            {currentTitle}
                        </div>
                        <div className={`${styles.line} ${isMobile ? styles.lineMobile : ''}`} />
                    </div>
                )}
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;