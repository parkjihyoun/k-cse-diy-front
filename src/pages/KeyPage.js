import React, { useState, useEffect } from "react";
import styles from "../styles/KeyPage.module.css";

const KeyPage = () => {
  const [status, setStatus] = useState(""); // 초기 상태를 'KEEPING'으로 설정
  const [showRules, setShowRules] = useState(false);
  const [showInputModal, setShowInputModal] = useState(false);
  const [studentName, setStudentName] = useState(""); // 이름
  const [studentNumber, setStudentNumber] = useState(""); // 학번
  const [actionType, setActionType] = useState(""); // '대여' 또는 '반납' 구분
  const [returnDate, setReturnDate] = useState(""); // 반납 시간
  const [roomKey, setRoomKey] = useState(""); // 열쇠
  const [actionStudent, setActionStudent] = useState(""); // 열쇠 사용자 추가

  // 새로운 useEffect 추가: 컴포넌트가 마운트될 때 열쇠 정보를 가져옴
  useEffect(() => {
    const fetchRoomKey = async () => {
      try {
        const response = await fetch("https://diy.knucse.site/api/v1/application/roomkey", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const responseData = await response.json();
          const { holderName, status: keyStatus } = responseData.response;

          // 상태와 사용자 이름 업데이트
          setStatus(keyStatus);
          setActionStudent(holderName);
        } else {
          console.error("열쇠 정보를 가져오는 데 실패했습니다.");
        }
      } catch (error) {
        console.error(`API 요청 중 오류 발생: ${error.message}`);
      }
    };

    fetchRoomKey();
  }, []); // 의존성 배열 비워서 컴포넌트 마운트 시 한 번 실행

  const toggleRulesModal = () => {
    setShowRules(!showRules);
  };

  const openInputModal = (type) => {
    setActionType(type);
    setShowInputModal(true);
  };

  const closeInputModal = () => {
    setShowInputModal(false);
    setStudentName("");
    setStudentNumber("");
  };

  const handleSubmit = async () => {
    const studentNumberRegex = /^\d{10}$/;
    if (!studentNumber.match(studentNumberRegex)) {
      alert("학번은 10자리의 숫자 형식이어야 합니다.\nex)2024XXXXXX");
      return;
    }

    const endpoint =
      actionType === "대여"
        ? "https://diy.knucse.site/api/v1/application/roomkey/rent"
        : "https://diy.knucse.site/api/v1/application/roomkey/return";

    const payload = { studentName, studentNumber };

    try {
      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const responseData = await response.json(); // API에서 반환된 KeyReadDto
        const { holderName, status: keyStatus } = responseData.response;

        setActionStudent(holderName);
        // 상태 업데이트
        setStatus(keyStatus === "USING" ? "USING" : "KEEPING");

        if (actionType === "반납") {
          const now = new Date();
          const formattedDate = `${now.getFullYear()}-${String(
            now.getMonth() + 1
          ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(
            now.getHours()
          ).padStart(2, "0")}:${String(now.getMinutes()).padStart(
            2,
            "0"
          )}:${String(now.getSeconds()).padStart(2, "0")}`;
          setReturnDate(formattedDate);
        }

        alert(
          `이름: ${holderName}, 학번: ${studentNumber}\n열쇠가 ${actionType === "대여" ? "대여" : "반납"
          }되었습니다.`
        );
      } else {
        const errorData = await response.json();
        if (response.status === 404) {
          if (errorData.code === "STUDENT_NOT_FOUND") {
            alert("학생 정보가 없습니다. 이름과 학번을 다시 확인해주세요.");
          } else if (errorData.code === "KEY_NOT_FOUND") {
            alert("열쇠가 없습니다.");
          } else {
            alert("알 수 없는 오류가 발생했습니다.");
          }
        } else {
          alert(`오류: ${errorData.message || "알 수 없는 오류가 발생했습니다."}`);
        }
      }
    } catch (error) {
      alert(`API 요청 실패: ${error.message}`);
    }

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
      </div>

      {/* 중앙 박스 */}
      <div className={styles.centerBox}>
        <h2 className={styles.roomTitle}>
          D.I.Y실
          <span
            className={`${styles.statusCircle2} ${status === "KEEPING" ? styles.canlentCircle : styles.usingCircle
              }`}
          />
        </h2>
        <p className={styles.roomSubtitle}>D.I.Y Room’s key</p>
        <hr className={styles.separator} />
        <p className={styles.lastUserTitle}>
          {status === "USING" ? "Using User" : "Last User"}
        </p>
        <p className={styles.lastUser}>{actionStudent}</p>
        <div className={styles.locationContainer}>
          <p className={styles.locationBox}>
            {status === "USING" ? "DIY실" : "IT4호관 과사무실"}
          </p>
          <p className={styles.eventTitle}>
            {status === "USING" ? "사용중" : "보관중"}
          </p>
        </div>
      </div>

      {/* 버튼 추가 */}
      <div className={styles.buttonContainer}>
        <button
          className={styles.actionButton}
          onClick={() => openInputModal("대여")}
        >
          열쇠 대여하기
        </button>
        <button
          className={styles.actionButton}
          onClick={() => openInputModal("반납")}
        >
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
            <ol>
              <li>IT4호관 사무실 방문</li>
              <li>사이트에서 열쇠 대여 또는 반납 진행</li>
            </ol>
            <button
              className={styles.actionButton}
              onClick={toggleRulesModal}
            >
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
              <label className={styles.label} htmlFor="name">
                이름
              </label>
              <input
                type="text"
                id="name"
                className={styles.input}
                placeholder="이름을 입력하세요"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />
            </div>
            <div className={styles.inputContainer}>
              <label className={styles.label} htmlFor="student_number">
                학번
              </label>
              <input
                type="text"
                id="student_number"
                className={styles.input}
                placeholder="학번을 입력하세요"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
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
