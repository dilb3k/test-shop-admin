import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Provider, useSelector } from "react-redux"
import { Toaster } from "react-hot-toast"
import store from "./store/store"
import Navbar from "./components/Navbar"
import Sidebar from "./components/Sidebar"
import ProtectedRoute from "./components/ProtectedRoute"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ProductsPage from "./pages/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage"
import OrdersPage from "./pages/OrdersPage"
import OrderDetailPage from "./pages/OrderDetailPage"
import toast from "react-hot-toast"
import "./i18n/i18n"
import { Box } from "@mui/material"

function AppContent() {
  const { token } = useSelector((s) => s.auth)
  const sidebarWidth = 280
  const navbarHeight = { xs: 56, sm: 64 }

  const showToast = (message, type = "success") => {
    if (type === "error") toast.error(message)
    else if (type === "warning") toast(message, { icon: "⚠️" })
    else toast.success(message)
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafb" }}>
      {token && <Sidebar sx={{ width: sidebarWidth, flexShrink: 0 }} />}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {token && <Navbar />}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            mt: token ? `${navbarHeight.sm}px` : 0,
            px: 2,
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage onToast={showToast} />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products"
              element={
                <ProtectedRoute>
                  <ProductsPage onToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/products/:id"
              element={
                <ProtectedRoute>
                  <ProductDetailPage onToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage onToast={showToast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:id"
              element={
                <ProtectedRoute>
                  <OrderDetailPage onToast={showToast} />
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>
      <Toaster position="top-right" />
    </Box>
  )
}

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}
