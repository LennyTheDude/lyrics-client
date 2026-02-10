import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.scss';

function AppLayout() {
  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
