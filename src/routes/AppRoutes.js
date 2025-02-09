import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../components/Layout';
import MainPage from '../pages/MainPage';
import CheckPage from '../pages/CheckPage';
import WeekPage from '../pages/WeekPage';
import MonthPage from '../pages/MonthPage';
import KeyPage from '../pages/KeyPage';
import HelpPage from '../pages/HelpPage';
import CheckListPage from '../pages/CheckListPage';
import TutorialPage from '../pages/TutorialPage';
import RulePage from '../pages/RulePage';
import AdminLoginPage from '../pages/Adminpage/LoginPage';
import AdminMonthPage from '../pages/Adminpage/AdminMonthPage';
import AdminWeekPage from '../pages/Adminpage/AdminWeekPage';
import AdminCheckPage from '../pages/Adminpage/AdminCheckPage';
import AdminKeyPage from '../pages/Adminpage/AdminKeyPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout 적용 */}
      <Route path="/" element={<Layout />}>
        <Route index element={<MainPage />} />
        <Route path="check" element={<CheckPage />} />
        <Route path="check/list" element={<CheckListPage />} />
        <Route path="week" element={<WeekPage />} />
        <Route path="month" element={<MonthPage />} />
        <Route path="key" element={<KeyPage />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="help/tutorial" element={<TutorialPage />} />
        <Route path="help/rule" element={<RulePage />} />
      </Route>

      {/* Admin 관련 라우팅 */}
      <Route path="admin" element={<AdminLoginPage />} />
      <Route path="admin/month" element={<AdminMonthPage />} />
      <Route path="admin/week" element={<AdminWeekPage />} />
      <Route path="admin/check" element={<AdminCheckPage />} />
      <Route path="admin/key" element={<AdminKeyPage />} />
    </Routes>
  );
};

export default AppRoutes;
