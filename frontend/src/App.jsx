import { Routes, Route, Navigate } from 'react-router-dom';
import { authStore } from './api';
import Layout from './components/Layout';
import Login from './pages/Login';
import PasswordRecovery from './pages/PasswordRecovery';
import Dashboard from './pages/Dashboard';
import Horses from './pages/Horses';
import Reservations from './pages/Reservations';
import Inventory from './pages/Inventory';
import Employees from './pages/Employees';
import Feeding from './pages/Feeding';
import Medical from './pages/Medical';
import Supplies from './pages/Supplies';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Audit from './pages/Audit';
function Private({ children, roles }) {
  const user = authStore.get();
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
}
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/olvide-contrasena" element={<PasswordRecovery />} />
      <Route
        path="/restablecer-contrasena"
        element={<PasswordRecovery reset />}
      />
      <Route
        path="/"
        element={
          <Private>
            <Dashboard />
          </Private>
        }
      />
      <Route
        path="/caballos"
        element={
          <Private>
            <Horses />
          </Private>
        }
      />
      <Route
        path="/salud"
        element={
          <Private roles={['ADMIN', 'VETERINARIAN']}>
            <Medical />
          </Private>
        }
      />
      <Route
        path="/reservas"
        element={
          <Private>
            <Reservations />
          </Private>
        }
      />
      <Route
        path="/inventario"
        element={
          <Private>
            <Inventory />
          </Private>
        }
      />
      <Route
        path="/alimentacion"
        element={
          <Private roles={['ADMIN', 'CAREGIVER']}>
            <Feeding />
          </Private>
        }
      />
      <Route
        path="/suministros"
        element={
          <Private roles={['ADMIN', 'CAREGIVER']}>
            <Supplies />
          </Private>
        }
      />
      <Route
        path="/reportes"
        element={
          <Private roles={['ADMIN', 'CAREGIVER', 'VETERINARIAN']}>
            <Reports />
          </Private>
        }
      />
      <Route
        path="/personal"
        element={
          <Private roles={['ADMIN']}>
            <Employees />
          </Private>
        }
      />
      <Route
        path="/usuarios"
        element={
          <Private roles={['ADMIN']}>
            <Users />
          </Private>
        }
      />
      <Route
        path="/auditoria"
        element={
          <Private roles={['ADMIN']}>
            <Audit />
          </Private>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
