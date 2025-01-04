import React, { useState } from 'react';
import styles from '../styles/KeyPage.module.css';

const KeyPage = () => {
  const [status, setStatus] = useState("대여가능");
  const [showRules, setShowRules] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [actionType, setActionType] = useState(""); // '대여' 또는 '반납' 구분
  const [returnDate, setReturnDate] = useState("2024-11-14 18:55:57"); // 초기 반납 시간 

  const toggleRulesModal = () => {
    setShowRules(!showRules);
  };

  const openInputModal = (type) => {
    setActionType(type);
    setShowInputModal(true);
  };

  const closeInputModal = () => {
    setShowInputModal(false);
    setName("");
    setStudentId("");
  };

  const handleSubmit = () => {
    const studentIdRegex = /^\d{10}$/;
    if (!studentId.match(studentIdRegex)) {
      alert("학번은 10자리의 숫자 형식이어야 합니다.\nex)2024XXXXXX");
      return;
    }

    if (actionType === "반납") {
      // 반납 시간 업데이트
      const now = new Date();
      const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      setReturnDate(formattedDate);
    }

    alert(`이름: ${name}, 학번: ${studentId}\n열쇠가 ${actionType === "대여" ? "대여" : "반납"}되었습니다.`);
    setStatus(actionType === "대여" ? "대여중" : "대여가능");
    closeInputModal();
  };

  return (
    <div className={styles.page}>
      {/* 상태 표시 */}
      <div className={styles.checkkey}>
        <div className={styles.item}>
          <div className={styles.textWithCircle}>
            <span className={styles.canlent}>대여가능</span>
            <span className={`${styles.statusCircle} ${styles.canlentCircle}`} />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.textWithCircle}>
            <span className={styles.using}>대여중</span>
            <span className={`${styles.statusCircle} ${styles.usingCircle}`} />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.textWithCircle}>
            <span className={styles.didntreturn}>미반납</span>
            <span className={`${styles.statusCircle} ${styles.didntreturnCircle}`} />
          </div>
        </div>
      </div>



      {/* 중앙 박스 */}
      <div className={styles.centerBox}>
        <h2 className={styles.roomTitle}>
          D.I.Y실
          <span
            className={`${styles.statusCircle2} ${status === "대여가능"
                ? styles.canlentCircle
                : status === "대여중"
                  ? styles.usingCircle
                  : styles.didntreturnCircle
              }`}
          />
        </h2>
        <p className={styles.roomSubtitle}>D.I.Y Room’s key</p>
        <hr className={styles.separator} />
        <p className={styles.lastUserTitle}>Last User</p>
        <p className={styles.lastUser}>호예찬</p>
        <p className={styles.eventTitle}>산사랑 연극 연습</p>
        <div className={styles.locationContainer}>
          <p className={styles.locationBox}>IT4호관 과사무실 반납완료</p>
          <p className={styles.date}>{returnDate}</p>
        </div>
      </div>

      {/* 버튼 추가 */}
      <div className={styles.buttonContainer}>
        <button className={styles.actionButton} onClick={() => openInputModal("대여")}>
          열쇠 대여하기
        </button>
        <button className={styles.actionButton} onClick={() => openInputModal("반납")}>
          열쇠 반납하기
        </button>
      </div>
      <div className={styles.rules} onClick={toggleRulesModal}>
        &lt;열쇠 대여 및 반납 규칙&gt;
      </div>

      {/* 규칙 모달 */}
      {showRules && (
        <div className={styles.ruleModal}>
          <div className={styles.ruleModalContent}>
            <h2>열쇠 대여 및 반납 규칙</h2>
            <div className={styles.ruleModalContentOi}>
            <ol>
              <li> <strong>IT4호관 사무실 방문</strong></li>
              <li>사이트의 열쇠 대여/반납 페이지에서 <strong>열쇠 대여하기</strong> 클릭</li>
              <li><strong>IT4호관 사무실에서 열쇠 대여</strong> 후 사이트의 <strong>대여 버튼</strong> 클릭</li>
              <li>사용 후 <strong>IT4호관 사무실에 열쇠 반납</strong></li>
              <li>열쇠 반납 후 열쇠 대여/반납 페이지에서 <strong>열쇠 반납하기</strong> 클릭</li>
            </ol>
            </div>
            <button className={styles.actionButton} onClick={toggleRulesModal}>
              닫기
            </button>
          </div>
        </div>
      )}

      {/* 입력 모달 */}
      {showInputModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>{actionType} 정보 입력</h2>
            <div className={styles.inputContainer}>
  <label className={styles.label} htmlFor="name">이름</label>
  <input
    type="text"
    id="name"
    className={styles.input}
    placeholder="이름을 입력하세요"
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
</div>
<div className={styles.inputContainer}>
  <label className={styles.label} htmlFor="studentId">학번</label>
  <input
    type="text"
    id="studentId"
    className={styles.input}
    placeholder="학번을 입력하세요"
    value={studentId}
    onChange={(e) => setStudentId(e.target.value)}
  />
</div>

            <div className={styles.modalButtonContainer}>
              <button className={styles.closeButton} onClick={handleSubmit}>
                확인
              </button>
              <button className={styles.closeButton} onClick={closeInputModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default KeyPage;
