import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

// 데스크탑 드로워 컴포넌트 (CSS 그대로 사용)
const DesktopDrawer = () => (
  <div style={styles.desktopDrawer}>
    <ul style={styles.drawerList2}>
      <li style={styles.drawerItem2}>
        <Link to="/month" style={styles.drawerLink2}>
          Month
        </Link>
      </li>
      <li style={styles.drawerItem2}>
        <Link to="/week" style={styles.drawerLink2}>
          Week
        </Link>
      </li>
    </ul>
  </div>
);

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
  const [menuOpen, setMenuOpen] = useState(false);
  const [desktopDrawerOpen, setDesktopDrawerOpen] = useState(false); // 데스크탑 드로워 상태
  const [drawerTimer, setDrawerTimer] = useState(null); // 드로워 타이머
  const [mobileSubDrawerOpen, setMobileSubDrawerOpen] = useState(false); // 모바일 예약하기 서브 드로워 상태

  // 모바일 드로워 DOM 접근을 위한 ref
  const mobileDrawerRef = useRef(null);

  // 화면 크기 변경 감지
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 600);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 모바일 드로워가 닫힐 때 서브 드로워도 함께 닫음
  useEffect(() => {
    if (!menuOpen) setMobileSubDrawerOpen(false);
  }, [menuOpen]);

  // 모바일 드로워 밖을 클릭하면 드로워 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuOpen &&
        mobileDrawerRef.current &&
        !mobileDrawerRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  // 데스크탑 드로워 토글 (2초 후 자동 닫힘)
  const toggleDesktopDrawer = () => {
    clearTimeout(drawerTimer);
    if (!desktopDrawerOpen) {
      setDesktopDrawerOpen(true);
      const timerId = setTimeout(() => setDesktopDrawerOpen(false), 2000);
      setDrawerTimer(timerId);
    } else {
      setDesktopDrawerOpen(false);
    }
  };

  // 모바일 메뉴와 서브 드로워 모두 닫는 함수
  const closeMobileMenu = () => {
    setMenuOpen(false);
    setMobileSubDrawerOpen(false);
  };

  // 모바일 예약하기 서브 드로워 토글
  const toggleMobileSubDrawer = () => {
    setMobileSubDrawerOpen((prev) => !prev);
  };

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/" style={styles.logoLink}>
          K:DIY
        </Link>
      </div>

      {isMobile ? (
        <>
          {/* 모바일 햄버거 메뉴 */}
          <div
            style={styles.menuIcon}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <div style={styles.hamburger} />
            <div style={styles.hamburger} />
            <div style={styles.hamburger} />
          </div>

          {/* 드로워가 열리면 페이지 어둡게 오버레이 */}
          {menuOpen && (
            <div style={styles.overlay} onClick={closeMobileMenu} />
          )}

          {/* 모바일 드로워 */}
          <div
            ref={mobileDrawerRef}
            style={{
              ...styles.mobileDrawer,
              transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
            }}
          >
            <ul style={styles.drawerList}>
              <li style={styles.drawerItem}>
                <Link
                  to="/"
                  style={styles.drawerLink}
                  onClick={closeMobileMenu}
                >
                  메인
                </Link>
              </li>
              <li style={styles.drawerItem} onClick={toggleMobileSubDrawer}>
                <div style={styles.drawerLink}>예약하기</div>
              </li>
              {mobileSubDrawerOpen && (
                <div style={styles.mobileSubDrawer}>
                  <ul style={styles.drawerList}>
                    <li style={styles.drawerItem}>
                      <Link
                        to="/month"
                        style={styles.drawerLink}
                        onClick={closeMobileMenu}
                      >
                        Month
                      </Link>
                    </li>
                    <li style={styles.drawerItem}>
                      <Link
                        to="/week"
                        style={styles.drawerLink}
                        onClick={closeMobileMenu}
                      >
                        Week
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
              <li style={styles.drawerItem}>
                <Link
                  to="/key"
                  style={styles.drawerLink}
                  onClick={closeMobileMenu}
                >
                  열쇠 대여/반납
                </Link>
              </li>
              <li style={styles.drawerItem}>
                <Link
                  to="/check"
                  style={styles.drawerLink}
                  onClick={closeMobileMenu}
                >
                  예약 확인/수정
                </Link>
              </li>
              <li style={styles.drawerItem}>
                <Link
                  to="/help"
                  style={styles.drawerLink}
                  onClick={closeMobileMenu}
                >
                  이용 안내
                </Link>
              </li>
            </ul>
          </div>
        </>
      ) : (
        // 데스크탑 메뉴
        <nav style={styles.nav}>
          <ul style={styles.navList}>
            <li className="nav-item" style={styles.navItem}>
              <Link to="/" style={styles.navLink}>
                메인
              </Link>
            </li>
            <li
              className="nav-item"
              style={styles.navItem}
              onClick={toggleDesktopDrawer}
            >
              <div style={styles.navLink}>예약하기</div>
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
          {desktopDrawerOpen && <DesktopDrawer />}
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
    right: '316px',
    position: 'relative',
    textAlign: 'center',
  },
  submenuList: {
    listStyle: 'none',
    margin: 0,
    padding: '10px 0 0 20px',
    transition: 'max-height 0.3s ease',
  },
  submenuItem: {
    marginBottom: '10px',
  },
  submenuLink: {
    color: '#000',
    textDecoration: 'none',
    fontSize: '16px',
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
  navItem: {},
  navLink: {
    color: 'white',
    textDecoration: 'none',
  },
};

export default Header;