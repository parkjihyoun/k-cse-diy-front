// src/components/AdminRoute.jsx
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const [isValid, setIsValid] = useState(null); // null: 검증 진행중, true: 유효, false: 무효
  const [loading, setLoading] = useState(true);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const validateToken = async () => {
      try {
        const response = await fetch("https://diy.knucse.site/api/v1/admin/validate-token", {
          method: "GET",
          headers: {
            Authorization: token,
          },
        });

        if (response.ok) {
          setIsValid(true);
        } else {
          setIsValid(false);
        }
      } catch (error) {
        setIsValid(false);
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  useEffect(() => {
    if (!loading && isValid === false && !alertShown) {
      alert("로그인이 필요합니다!");
      setAlertShown(true);
      localStorage.removeItem("token");
    }
  }, [loading, isValid, alertShown]);

  if (loading) return <div>Loading...</div>;

  // 토큰이 유효하지 않으면 로그인 페이지로 이동
  if (!isValid) {
    return <Navigate to="/admin" replace />;
  }

  // 토큰이 유효하면 자식 라우트를 렌더링
  return <Outlet />;
};

export default AdminRoute;