import React, { useState, useEffect } from 'react';
import cselogo from '../img/cselogo.png';

const Footer = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // 현재 화면 너비로 초기 상태 설정
        const updateIsMobile = () => {
            const width = window.innerWidth;
            console.log(`Current width: ${width}`); // 디버깅용
            setIsMobile(width <= 600);
        };

        // 초기 실행
        updateIsMobile();

        // 리사이즈 이벤트 등록
        window.addEventListener('resize', updateIsMobile);

        // 정리 함수 등록
        return () => window.removeEventListener('resize', updateIsMobile);
    }, []);

    return (
        <footer style={{ ...styles.footer, ...(isMobile ? styles.footerMobile : {}) }}>
            <img
                src={cselogo}
                alt="cselogo"
                style={{ ...styles.cselogo, ...(isMobile ? styles.cselogoMobile : {}) }}
            />
            <p style={isMobile ? styles.textMobile : {}}>made by: @yeaey_oo | @unnhyo | @w.o_xna | @y___ch__</p>
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
    footerMobile: {
        padding: '10px', // 모바일에서 줄어든 푸터 크기
    },
    cselogo: {
        width: '50px',
        marginBottom: '15px',
    },
    cselogoMobile: {
        width: '40px', // 모바일에서 로고 크기 축소
    },
    textMobile: {
        fontSize: '12px', // 모바일에서 글자 크기 축소
    },
};

export default Footer;