import React, { useState } from "react";
import styles from "../styles/TutorialPage.module.css";

const TutorialPage = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 열고 닫기 상태

  return (
    <div className={styles.RulePage}>
      <div className={styles.RulesContainer}>
        {/* 제목 클릭 시 열고 닫기 */}
        <div className={styles.RulesHeader}>
          <h2>예약 방법</h2>
        </div>
        {/* 열려 있을 때만 표시 */}

          <div className={styles.Rules}>
            <ol>
              <li>메인 페이지의 '지금 예약하기' 클릭(또는 상단 오른쪽의 예약 버튼 클릭)</li>
              <li>달력에서 빈 시간과 날짜 확인 후 날짜 선택, 예약하기 버튼 클릭</li>
              <li>이름과 학번, 예약 시간, 예약 사유를 작성합니다.</li>
              <li>초기 비밀번호 설정 후 예약하기 클릭, 비밀번호는 예약 확인, 취소 시 필요하니 꼭 기억해 주세요.</li>
              <li>해당 날짜의 예약 대기 표시가 예약 완료로 변경되면 예약 확정입니다.</li>
            </ol>
          </div>
      </div>
    </div>
  );
};

export default TutorialPage;
