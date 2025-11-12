import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ordersAPI } from "../api/apiService"
import { useTranslation } from "react-i18next"
import {
  Container,
  Box,
  Typography,
  Button,
  Alert,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Paper,
} from "@mui/material"
import ArrowBackIcon from "@mui/icons-material/ArrowBack"

export default function OrderDetailPage({ onToast }) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await ordersAPI.getById(id)
        setOrder(res.data.data)
      } catch (err) {
        const msg = err.response?.data?.message || t("common.error")
        setError(msg)
        onToast?.(msg, "error")
      } finally {
        setLoading(false)
      }
    }
    fetchOrder()
  }, [id])

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      CONFIRMED: "info",
      SHIPPED: "primary",
      DELIVERED: "success",
      CANCELLED: "error",
    }
    return colors[status] || "default"
  }

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography>{t("common.loading")}</Typography>
      </Container>
    )
  }

  if (error || !order) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">{error || t("common.notFound")}</Alert>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate("/orders")} sx={{ color: "#5CAB7A", mb: 3 }}>
        {t("common.back")}
      </Button>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  {t("orders.orderNumber")} #{order.id}
                </Typography>
                <Chip label={order.status} color={getStatusColor(order.status)} size="medium" />
              </Box>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {t("orders.customer")}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {order.customerName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {order.customerEmail}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: "#666" }}>
                    {t("orders.date")}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {new Date(order.orderDate).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2, mt: 3 }}>
                {t("orders.items")}
              </Typography>

              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>{t("products.name")}</TableCell>
                      <TableCell align="center" sx={{ fontWeight: "bold" }}>
                        {t("orders.quantity")}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {t("products.price")}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: "bold" }}>
                        {t("orders.total")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.orderItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell align="center">{item.quantity}</TableCell>
                        <TableCell align="right">${item.unitPrice.toFixed(2)}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold", color: "#5CAB7A" }}>
                          ${item.totalPrice.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ backgroundColor: "#f9f9f9" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                {t("orders.orderSummary")}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  {t("orders.subtotal")}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  ${(order.totalAmount * 0.9).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ mb: 2, pb: 2, borderBottom: "1px solid #ddd" }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  {t("orders.tax")}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  ${(order.totalAmount * 0.1).toFixed(2)}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                  {t("orders.totalAmount")}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: "bold", color: "#5CAB7A" }}>
                  ${order.totalAmount.toFixed(2)}
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate("/orders")}
                sx={{ color: "#5CAB7A", borderColor: "#5CAB7A" }}
              >
                {t("common.back")}
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
