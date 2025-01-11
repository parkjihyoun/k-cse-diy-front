import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/HelpPage.module.css';

const HelpPage = () => {
  const navigate = useNavigate(); // useNavigate 훅 초기화

  const handleNavigateToTutorial = () => {
    navigate('/help/tutorial'); // 원하는 경로로 이동
  };
  const handleNavigateToRule = () => {
    navigate('/help/rule'); // 원하는 경로로 이동
  };

  return (
    <div className={styles.helppage}> {/* styles.클래스명으로 참조 */}
        <div className={styles.tutorial}>
          <button className={styles.helpButton} onClick={handleNavigateToTutorial}>예약 방법 및 FAQ</button>
       </div>
       <div className={styles.rule}>
          <button className={styles.helpButton} onClick={handleNavigateToRule}>이용 규칙</button>
       </div>
    </div>
  );
};

export default HelpPage;