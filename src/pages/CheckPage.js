import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/CheckPage.module.css";

const CheckPage = () => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [popupMessage, setPopupMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = () => {
    const studentIdRegex = /^\d{10}$/;
    if (!studentId.match(studentIdRegex)) {
      setPopupMessage("학번은 10자리의 숫자 형식이어야 합니다.\nex)2024XXXXXX");
      setShowPopup(true);
      return;
    }

    setTimeout(() => {
      setShowPopup(false);
      navigate("/check/list", {
        state: { name, studentId },
      });
    }, 300);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <label htmlFor="name" className={styles.label}>
          이름
        </label>
        <input
          type="text"
          id="name"
          className={styles.input}
          placeholder="이름을 입력하세요"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label htmlFor="student-id" className={styles.label}>
          학번
        </label>
        <input
          type="text"
          id="student-id"
          className={styles.input}
          placeholder="학번을 입력하세요"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
        />

        <button className={styles.button} onClick={handleSubmit}>
          확인
        </button>
      </div>

      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2 className={styles.popupTitle}>경고</h2> {/* 경고 제목 추가 */}
            {popupMessage.split("\n").map((line, index) => (
              <p key={index}>{line}</p>
            ))}
            <button className={styles.closeButton} onClick={closePopup}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckPage;