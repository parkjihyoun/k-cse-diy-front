import React, { useState } from "react";
import styles from "../styles/TutorialPage.module.css";

const TutorialPage = () => {
  const [isExpanded, setIsExpanded] = useState(false); // 열고 닫기 상태

  return (
    <div className={styles.RulePage}>
  <div className={styles.RulesContainer}>
    <div className={styles.RulesHeader}>
      <h2>예약 방법</h2>
    </div>
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

  <div className={styles.EditContainer}>
    <div className={styles.EditHeader}>
      <h2>예약 확인/수정 방법</h2>
    </div>
    <div className={styles.Edit}>
    <ol>
              <li>상단 오른쪽의 예약 확인/수정 버튼 클릭</li>
              <li>이름과 학번 입력 후 예약 정보 확인</li>
              <li>이름과 학번, 예약 시간, 예약 사유를 작성합니다.</li>
              <li>초기 비밀번호 설정 후 예약하기 클릭, 비밀번호는 예약 확인, 취소 시 필요하니 꼭 기억해 주세요.</li>
              <li>해당 날짜의 예약 대기 표시가 예약 완료로 변경되면 예약 확정입니다.</li>
            </ol>
    </div>
  </div>

  {/* FaqWrapper 추가 */}
    <div className={styles.FaqContainer}>
      <div className={styles.FaqHeader}>
      <h2>FAQ</h2>
      </div>
    <div className={styles.FaqSHeader}>
        <h2>Q. 예약 승인까지 얼마나 걸리나요?</h2>
      </div>
      <div className={styles.Faq}>
        <li>- 평일 기준 2~3일 정도 소요됩니다.</li>
      </div>
      <div className={styles.FaqSHeader}>
        <h2>Q. 익일 새벽까지 예약하고 싶은데 어떻게 해야 하나요?</h2>
      </div>
      <div className={styles.Faq}>
        <li>- 당일 자정과 익일 새벽, 두 번 예약해주시면 됩니다.</li>
      </div>
      <div className={styles.FaqSHeader}>
        <h2>Q. 열쇠 대여하기 버튼을 깜박하고 못눌렀어요.</h2>
      </div>
      <div className={styles.Faq}>
        <li>- 반납 시간 이후 반납하거나 사이트에서 대여 버튼을 누르지 않고 열쇠를 대여하면 패널티가 적용될 수 있으니 유의해 주세요.</li>
      </div>

      <div className={styles.FaqSHeader}>
        <h2>Q. 예약 내역을 못찾겠어요!</h2>
      </div>
      <div className={styles.Faq}>
        <li>- 동연의장 이동혁 (Kakao ID : abc123)으로 문의 바랍니다.</li>
      </div>
    </div>
    </div>

  );
};

export default TutorialPage;