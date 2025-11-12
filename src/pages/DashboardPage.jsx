import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { ordersAPI, productsAPI } from "../api/apiService"
import { useTranslation } from "react-i18next"
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material"
import TrendingUpIcon from "@mui/icons-material/TrendingUp"
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart"
import InventoryIcon from "@mui/icons-material/Inventory"

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useSelector((s) => s.auth)
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([ordersAPI.getAll(0, 100), productsAPI.getAll(0, 100)])

        const allOrders = ordersRes.data.data.content || []
        const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0)

        setStats({
          totalOrders: ordersRes.data.data.totalElements || 0,
          totalProducts: productsRes.data.data.totalElements || 0,
          totalRevenue,
          recentOrders: allOrders.slice(0, 5),
        })
      } catch (err) {
        console.error("Error fetching stats:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <Card
      sx={{
        backgroundColor: "white",
        border: `2px solid ${color}`,
        transition: "all 0.3s",
        "&:hover": { transform: "translateY(-4px)", boxShadow: "0 8px 16px rgba(0,0,0,0.1)" },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="body2" sx={{ color: "#666", mb: 0.5 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#333" }}>
              {value}
            </Typography>
          </Box>
          <Icon sx={{ fontSize: 48, color, opacity: 0.3 }} />
        </Box>
      </CardContent>
    </Card>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          {t("dashboard.welcome")}, {user?.username}!
        </Typography>
        <Typography variant="body2" sx={{ color: "#666" }}>
          {new Date().toLocaleDateString()}
        </Typography>
      </Box>

      {!loading && (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={ShoppingCartIcon}
                title={t("dashboard.totalOrders")}
                value={stats.totalOrders}
                color="#5CAB7A"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={InventoryIcon}
                title={t("dashboard.totalProducts")}
                value={stats.totalProducts}
                color="#FF9800"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={TrendingUpIcon}
                title={t("dashboard.totalRevenue")}
                value={`$${stats.totalRevenue.toFixed(2)}`}
                color="#2196F3"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                icon={ShoppingCartIcon}
                title="Active Products"
                value={Math.floor(stats.totalProducts * 0.8)}
                color="#4CAF50"
              />
            </Grid>
          </Grid>

          {stats.recentOrders.length > 0 && (
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
                  {t("dashboard.recentOrders")}
                </Typography>

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell sx={{ fontWeight: "bold" }}>{t("orders.id")}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{t("orders.customer")}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{t("orders.date")}</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }} align="right">
                          {t("orders.total")}
                        </TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>{t("orders.status")}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {stats.recentOrders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>#{order.id}</TableCell>
                          <TableCell>{order.customerName}</TableCell>
                          <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                          <TableCell align="right" sx={{ color: "#5CAB7A", fontWeight: "bold" }}>
                            ${order.totalAmount.toFixed(2)}
                          </TableCell>
                          <TableCell>
                            <Chip label={order.status} size="small" color="primary" />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </Container>
  )
}
