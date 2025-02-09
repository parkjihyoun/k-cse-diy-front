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
import AdminLoginPage from '../pages/Admin/LoginPage';
import AdminMonthPage from '../pages/Admin/AdminMonthPage';
import AdminWeekPage from '../pages/Admin/AdminWeekPage';
import AdminCheckPage from '../pages/Admin/AdminCheckPage';
import AdminKeyPage from '../pages/Admin/AdminKeyPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout 적용 */}
      <Route path="/" element={<Layout />}>
        {/* Layout 내부의 페이지들 */}
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
      <Route path="admin" element={<AdminLoginPage />}>
        <Route path="month" element={<AdminMonthPage />} />
        <Route path="week" element={<AdminWeekPage />} />
        <Route path="check" element={<AdminCheckPage />} />
        <Route path="key" element={<AdminKeyPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;