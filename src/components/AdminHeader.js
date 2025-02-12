import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const AdminDesktopDrawer = () => (
  <div style={styles.desktopDrawer}>
    <ul style={styles.drawerList2}>
      <li style={styles.drawerItem2}>
        <Link to="/admin/month" style={styles.drawerLink2}>
          MONTH
        </Link>
      </li>
      <li style={styles.drawerItem2}>
        <Link to="/admin/week" style={styles.drawerLink2}>
          WEEK
        </Link>
      </li>
    </ul>
  </div>
);

const AdminHeader = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false);
  const [mobileSubDrawerOpen, setMobileSubDrawerOpen] = useState(false);

  const mobileDrawerRef = useRef(null);
  const drawerTimerRef = useRef(null);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 모바일 드로워가 닫힐 때 서브 드로워도 함께 닫기
  useEffect(() => {
    if (!menuOpen) setMobileSubDrawerOpen(false);
  }, [menuOpen]);

  // 데스크탑 드로워 토글 및 2초 후 자동 닫힘
  const toggleDesktopDrawer = () => {
    if (drawerTimerRef.current) {
      clearTimeout(drawerTimerRef.current);
    }
    if (!desktopDrawerOpen) {
      setDesktopDrawerOpen(true);
      drawerTimerRef.current = setTimeout(() => setDesktopDrawerOpen(false), 2000);
    } else {
      setDesktopDrawerOpen(false);
    }
  };

  // 모바일 메뉴 및 서브 메뉴 닫기
  const closeMobileMenu = () => {
    setMenuOpen(false);
    setMobileSubDrawerOpen(false);
  };

  // 모바일 서브 드로워 토글
  const toggleMobileSubDrawer = () => {
    setMobileSubDrawerOpen(prev => !prev);
  };

  // 모바일 드로워 외부 클릭 시 닫기
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuOpen && mobileDrawerRef.current && !mobileDrawerRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [menuOpen]);

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/admin" style={styles.logoLink}>
          관리자용 K:DIY
        </Link>
      </div>

      {isMobile ? (
        <>
          {/* 모바일 햄버거 메뉴 */}
          <div style={styles.menuIcon} onClick={() => setMenuOpen(prev => !prev)}>
            <div style={styles.hamburger} />
            <div style={styles.hamburger} />
            <div style={styles.hamburger} />
          </div>

          {menuOpen && (
            <>
              <div style={styles.overlay} onClick={closeMobileMenu} />
              <div
                ref={mobileDrawerRef}
                style={{
                  ...styles.mobileDrawer,
                  transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
                }}
              >
                <ul style={styles.drawerList}>
                  <li style={styles.drawerItem} onClick={toggleMobileSubDrawer}>
                    <div style={styles.drawerLink}>예약하기</div>
                  </li>
                  {mobileSubDrawerOpen && (
                    <div style={styles.mobileSubDrawer}>
                      <ul style={styles.drawerList}>
                        <li style={styles.drawerItem}>
                          <Link to="/admin/month" style={styles.drawerLink} onClick={closeMobileMenu}>
                            MONTH
                          </Link>
                        </li>
                        <li style={styles.drawerItem}>
                          <Link to="/admin/week" style={styles.drawerLink} onClick={closeMobileMenu}>
                            WEEK
                          </Link>
                        </li>
                      </ul>
                    </div>
                  )}
                  <li style={styles.drawerItem}>
                    <Link to="/admin/key" style={styles.drawerLink} onClick={closeMobileMenu}>
                      열쇠 대여/반납
                    </Link>
                  </li>
                  <li style={styles.drawerItem}>
                    <Link to="/admin/check" style={styles.drawerLink} onClick={closeMobileMenu}>
                      예약 확인/수정
                    </Link>
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      ) : (
        // 데스크탑 메뉴
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            <li
              className="nav-item"
              style={{ ...styles.navItem, position: 'relative' }}
              onClick={toggleDesktopDrawer}
            >
              <div style={styles.navLink}>예약하기</div>
              {desktopDrawerOpen && <AdminDesktopDrawer />}
            </li>
            <li className="nav-item" style={styles.navItem}>
              <Link to="/admin/key" style={styles.navLink}>
                열쇠 대여/반납
              </Link>
            </li>
            <li className="nav-item" style={styles.navItem}>
              <Link to="/admin/check" style={styles.navLink}>
                예약 확인/수정
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
  logoLink: {
    color: 'white',
    textDecoration: 'none',
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
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    zIndex: 1400,
  },
  mobileDrawer: {
    position: 'fixed',
    top: 0,
    right: 0,
    width: '300px',
    height: '100%',
    backgroundColor: '#fff',
    color: '#000',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: '100px',
    paddingRight: '20px',
    paddingLeft: '20px',
    boxShadow: '-2px 0 6px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.3s ease',
    zIndex: 1500,
  },
  mobileSubDrawer: {
    backgroundColor: '#fff',
    color: '#000',
    padding: '10px',
    paddingTop: 0,
  },
  desktopDrawer: {
    position: 'fixed',
    top: '73.5px',
    right: 0,
    width: '100%',
    height: '100px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingRight: '20px',
    paddingLeft: '20px',
    boxShadow: '-2px 0 6px rgba(0, 0, 0, 0.3)',
    transition: 'transform 0.5s ease',
    zIndex: 2000,
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
    borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  },
  drawerLink: {
    color: '#000',
    textDecoration: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
  drawerList2: {
    listStyle: 'none',
    paddingTop: 0,
    marginBottom: '10px',
    textAlign: 'right',
  },
  drawerItem2: {
    marginBottom: '15px',
    paddingBottom: '15px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  drawerLink2: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '16px',
    position: 'relative',
    textAlign: 'center',
    right: '231px',
  },
  nav: {
    display: 'flex',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '20px',
    margin: 0,
  },
  navItem: {
    cursor: 'pointer',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
  },
};

export default AdminHeader;