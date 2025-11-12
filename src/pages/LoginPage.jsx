import { useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { setLoading, setUser, setError } from "../store/slices/authSlice"
import { authAPI } from "../api/apiService"
import { useTranslation } from "react-i18next"
import { Container, Box, TextField, Button, Typography, Alert, Card } from "@mui/material"
import LockIcon from "@mui/icons-material/Lock"

export default function LoginPage({ onToast }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ username: "", password: "" })
  const [error, setLocalError] = useState("")
  const [loading, setLocalLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError("")

    if (!formData.username || !formData.password) {
      setLocalError(t("auth.requiredFields"))
      return
    }

    setLocalLoading(true)
    dispatch(setLoading())

    try {
      const response = await authAPI.login(formData.username, formData.password)
      const { data } = response.data
      dispatch(
        setUser({
          token: data.token,
          user: { username: data.username, email: data.email, role: data.role },
        }),
      )
      onToast?.(t("auth.loginSuccess"), "success")
      navigate("/dashboard")
    } catch (err) {
      const errorMsg = err.response?.data?.message || t("auth.loginFailed")
      setLocalError(errorMsg)
      dispatch(setError(errorMsg))
      onToast?.(errorMsg, "error")
    } finally {
      setLocalLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f5f5f5" }}>
      <Container maxWidth="sm">
        <Card elevation={3} sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                mb: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: "#5CAB7A",
                  borderRadius: "50%",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <LockIcon sx={{ color: "white", fontSize: 32 }} />
              </Box>
            </Box>
            <Typography variant="h4" fontWeight="bold" sx={{ color: "#5CAB7A", mb: 1 }}>
              {t("auth.login")}
            </Typography>
            <Typography variant="body2" sx={{ color: "#666" }}>
              {t("auth.adminPanel")}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label={t("auth.username")}
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
            />
            <TextField
              fullWidth
              label={t("auth.password")}
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              variant="outlined"
              disabled={loading}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#5CAB7A",
                "&:hover": { backgroundColor: "#4a9b6a" },
                py: 1.5,
                fontWeight: "bold",
              }}
              type="submit"
              disabled={loading}
            >
              {loading ? t("common.loading") : t("auth.login")}
            </Button>
          </form>
        </Card>
      </Container>
    </div>
  )
}
