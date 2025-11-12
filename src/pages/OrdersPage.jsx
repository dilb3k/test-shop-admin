import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  setLoading,
  setOrders,
  setError,
  deleteOrder,
  updateOrderStatus,
} from "../store/slices/ordersSlice";
import { ordersAPI } from "../api/apiService";
import { useTranslation } from "react-i18next";
import {
  Container,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Chip,
  Alert,
  AlertTitle,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import PaginationComponent from "../components/PaginationComponent";

export default function OrdersPage({ onToast }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items, loading, error, pagination } = useSelector((s) => s.orders);
  const { user } = useSelector((s) => s.auth);

  const urlPage = parseInt(searchParams.get("page") || "0", 10);
  const [page, setPage] = useState(urlPage);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  const updateURL = useCallback(
    (p) => {
      const params = new URLSearchParams();
      if (p > 0) params.set("page", String(p));
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const fetchOrders = useCallback(
    async (pageVal = 0) => {
      dispatch(setLoading());
      try {
        const res = await ordersAPI.getAll(pageVal, 10);
        dispatch(setOrders(res.data.data));
      } catch (err) {
        const msg = err.response?.data?.message || t("common.error");
        dispatch(setError(msg));
        onToast?.(msg, "error");
      }
    },
    [dispatch, t, onToast]
  );

  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  useEffect(() => {
    if (page !== urlPage) updateURL(page);
  }, [page, urlPage, updateURL]);

  useEffect(() => {
    fetchOrders(page);
  }, [page, fetchOrders]);

  const handleConfirmOrder = async (id) => {
    setUpdating(true);
    try {
      await ordersAPI.updateStatus(id, "CONFIRMED");
      dispatch(updateOrderStatus({ id, status: "CONFIRMED" }));
      onToast?.(t("orders.statusUpdateSuccess"), "success");
      fetchOrders(page);
    } catch (err) {
      onToast?.(err.response?.data?.message || t("common.error"), "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelOrder = async (id) => {
    setDeleting(true);
    try {
      await ordersAPI.cancel(id);
      dispatch(deleteOrder(id));
      onToast?.(t("orders.cancelSuccess"), "success");
      fetchOrders(page);
    } catch (err) {
      onToast?.(err.response?.data?.message || t("common.error"), "error");
    } finally {
      setDeleting(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      CONFIRMED: "info",
      SHIPPED: "primary",
      DELIVERED: "success",
      CANCELLED: "error",
    };
    return colors[status] || "default";
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {t("orders.title")}
        </Typography>
        {user?.role !== "ADMIN" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            href="/orders/new"
            sx={{ backgroundColor: "#5CAB7A", "&:hover": { backgroundColor: "#4a9b6a" } }}
          >
            {t("orders.createNew")}
          </Button>
        )}
      </Box>

      {loading && (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography>{t("common.loading")}</Typography>
        </Box>
      )}
      {!loading && error && (
        <Alert severity="error">
          <AlertTitle>{t("common.error")}</AlertTitle>
          {error}
        </Alert>
      )}
      {!loading && !error && items.length === 0 && (
        <Alert severity="info">
          <AlertTitle>{t("orders.noOrders")}</AlertTitle>
          {user?.role === "ADMIN" ? t("orders.noOrdersAdmin") : t("orders.noOrdersCustomer")}
        </Alert>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#5CAB7A" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("orders.id")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("orders.customer")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("orders.date")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">
                    {t("orders.total")}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("orders.status")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    {t("common.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((order) => (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: "bold" }}>#{order.id}</TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {order.customerName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#666" }}>
                          {order.customerEmail}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "#5CAB7A" }}>
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Chip label={order.status} color={getStatusColor(order.status)} size="small" />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        size="small"
                        startIcon={<VisibilityIcon />}
                        onClick={() => (window.location.href = `/orders/${order.id}`)}
                        sx={{ color: "#5CAB7A", mr: 1 }}
                      >
                        {t("common.view")}
                      </Button>
                      {order.status === "PENDING" && (
                        <>
                          <Button
                            size="small"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => handleConfirmOrder(order.id)}
                            disabled={updating}
                            sx={{ color: "#4caf50", mr: 1 }}
                          >
                            {t("orders.statusConfirmed")}
                          </Button>
                          <Button
                            size="small"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleCancelOrder(order.id)}
                            disabled={deleting}
                            sx={{ color: "#d32f2f" }}
                          >
                            {t("orders.cancel")}
                          </Button>
                        </>
                      )}
                      {user?.role === "ADMIN" && order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                        <Button
                          size="small"
                          startIcon={<DeleteIcon />}
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={deleting}
                          sx={{ color: "#d32f2f" }}
                        >
                          {t("orders.cancel")}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PaginationComponent
            currentPage={page}
            totalPages={pagination.totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </Container>
  );
}