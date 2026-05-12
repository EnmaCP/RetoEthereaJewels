import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Header from './components/header'
import { ProductDetail } from './components/productDetail'
import { NotFound } from './components/NotFound'
import { CheckoutPage } from './components/CheckoutPage'
import IntranetLayout from './components/IntranetLayout'
import IntranetHome from './components/IntranetHome'
import ClockInPage from './components/ClockInPage'
import AdminUsers from './components/AdminUsers'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import { UserProvider } from './components/UserContext'
import PrivateRoute from './components/PrivateRoute'
import OrdersPanel from "./components/OrdersPanel";
import { OrderHistory } from './components/OrderHistory';
import EditProductPage from './components/EditProductPage';
import ShoppingCart from './components/ShoppingCart';
import Catalogue from './components/Catalogue';
import { Wishlist } from './components/Wishlist'
import { Committee } from './components/ComiteEmpresa'
import { Acuerdos } from './components/Acuerdos'
import { PermisosVacaciones } from './components/PermisosVacaciones'
import { Personalization } from './components/Personalization'
createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <UserProvider>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<ShoppingCart />} />
        <Route path="/catalogue" element={<Catalogue />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/personalization" element={<Personalization />} />
        <Route
          path="/checkout"
          element={
            <PrivateRoute>
              <CheckoutPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/mis-pedidos"
          element={
            <PrivateRoute>
              <OrderHistory />
            </PrivateRoute>
          }
        />

        <Route
          path="/intranet"
          element={
            <PrivateRoute roles={["employee", "admin"]}>
              <IntranetLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<IntranetHome />} />
          <Route path="fichajes" element={<ClockInPage />} />
          <Route path="comite-empresa" element={<Committee />} />
          <Route path="acuerdos" element={<Acuerdos />} />
          <Route path="permisos-vacaciones" element={<PermisosVacaciones />} />
        </Route>

        <Route
          path="/admin/orders"
          element={
            <PrivateRoute roles={["admin", "employee"]}>
              <OrdersPanel />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <PrivateRoute roles={["admin"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products/:id/edit"
          element={
            <PrivateRoute roles={["admin"]}>
              <EditProductPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </UserProvider>
  </BrowserRouter>
)