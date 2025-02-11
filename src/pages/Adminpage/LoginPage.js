import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/LoginPage.module.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // 오류 메시지 상태
  const [token, setToken] = useState(null); // 토큰 상태

  const navigate = useNavigate();

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("https://diy.knucse.site/api/v1/login", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const token = response.headers.get("Authorization");

        // 로컬 스토리지에 토큰 저장
        localStorage.setItem("token", token);
        setToken(token);
        console.log(token);

        // 로그인 성공 시 페이지 이동
        navigate("/admin/month");
      } else {
        console.log("실패");
        setError("로그인 실패. 아이디와 비밀번호를 확인해주세요.");
      }
    } catch (error) {
      console.log(error);
      setError("서버와 연결할 수 없습니다.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/admin");
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        {token ? (
          <button className={styles.button} onClick={handleLogout}>
            로그아웃
          </button>
        ) : (
          <>
            <label htmlFor="username" className={styles.label}>
              아이디
            </label>
            <input
              type="text"
              id="username"
              className={styles.input}
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <label htmlFor="password" className={styles.label}>
              비밀번호
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button className={styles.button} onClick={handleLogin}>
              로그인
            </button>
          </>
        )}
      </div>
    </div>
  );
}
