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
      </Route>
    </Routes>
  );
};

export default AppRoutes;