import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/LoginPage.module.css";

export default function LoginPage() {
  const [admin_id, setAdminId] = useState("");
  const [admin_pw, setAdminPw] = useState("");

  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/admin/month", {
      state: { admin_id, admin_pw },
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <label htmlFor="admin-id" className={styles.label}>
          아이디
        </label>
        <input
          type="text"
          id="admin-id"
          className={styles.input}
          placeholder="아이디를 입력하세요"
          value={admin_id}
          onChange={(e) => setAdminId(e.target.value)}
        />

        <label htmlFor="admin-pw" className={styles.label}>
          비밀번호
        </label>
        <input
          type="text"
          id="admin-pw"
          className={styles.input}
          placeholder="비밀번호를 입력하세요"
          value={admin_pw}
          onChange={(e) => setAdminPw(e.target.value)}
        />

        <button className={styles.button} onClick={handleNavigate}>
          확인
        </button>
      </div>
    </div>
  );
}