import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/TutorialPage.module.css';
import mainImage from '../img/main.png'; // 첫 번째 이미지
import calendarImage from '../img/calendar.png'; // 두 번째 이미지
import timeImage from '../img/time.png'; // 세 번째 이미지

const TutorialPage = () => {
  const images = [mainImage, calendarImage, timeImage]; // 이미지 배열
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // 현재 이미지 인덱스
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate

  // 3초마다 이미지 변경
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => prevIndex + 1);
    }, 3000);

    // 모든 이미지가 끝나면 HelpPage로 이동
    if (currentImageIndex >= images.length) {
      navigate('/help');
    }

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, [currentImageIndex, images.length, navigate]);

  // 스킵 버튼 클릭 시 HelpPage로 이동
  const handleSkip = () => {
    navigate('/help');
  };

  return (
    <div className={styles.tutorialPage}>
      <button className={styles.skipButton} onClick={handleSkip}>
      Skip&gt;&gt;
      </button>
      <div className={styles.imageContainer}>
          {currentImageIndex < images.length && (
            <img
              src={images[currentImageIndex]}
              alt={`Slide ${currentImageIndex + 1}`}
              className={styles.mainImage}
            />)}
        </div>
    </div>
  );
};

export default TutorialPage;
