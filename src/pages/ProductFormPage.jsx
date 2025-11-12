import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct, updateProduct } from "../store/slices/productsSlice";
import { productsAPI } from "../api/apiService";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

export default function ProductFormModal({
  open,
  onClose,
  productId,
  onToast,
  onSuccess,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isEdit = !!productId;

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetching, setFetching] = useState(isEdit);

  // Ma'lumotlarni yuklash (tahrirlash uchun)
  useEffect(() => {
    if (!isEdit || !open) return;

    setFetching(true);
    productsAPI
      .getById(productId)
      .then((res) => {
        const d = res.data.data;
        setForm({
          name: d.name ?? "",
          price: d.price ?? "",
          stock: d.stock ?? "",
          category: d.category ?? "",
          isActive: d.isActive ?? true,
        });
      })
      .catch((err) => {
        const msg = err.response?.data?.message || t("common.error");
        setError(msg);
        onToast?.(msg, "error");
      })
      .finally(() => setFetching(false));
  }, [productId, isEdit, open, t, onToast]);

  // Form o‘zgarishi
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  // Validatsiya
  const validate = () => {
    if (!form.name.trim()) return t("products.nameRequired");
    if (!form.price || Number(form.price) <= 0) return t("products.priceInvalid");
    if (form.stock === "" || Number(form.stock) < 0) return t("products.stockInvalid");
    if (!form.category.trim()) return t("products.categoryRequired");
    return null;
  };

  // Submit
  const handleSubmit = async () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError("");

    try {
      let res;
      if (isEdit) {
        res = await productsAPI.update(productId, form);
        dispatch(updateProduct(res.data.data));
        onToast?.(t("products.updateSuccess"), "success");
      } else {
        res = await productsAPI.create(form);
        dispatch(addProduct(res.data.data));
        onToast?.(t("products.createSuccess"), "success");
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || t("common.error");
      setError(msg);
      onToast?.(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  // Modal yopilganda formni tozalash
  const handleClose = () => {
    setForm({
      name: "",
      price: "",
      stock: "",
      category: "",
      isActive: true,
    });
    setError("");
    onClose();
  };

  if (fetching) {
    return (
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogContent sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" fontWeight="bold">
          {isEdit ? t("products.editProduct") : t("products.newProduct")}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("products.name")}
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("products.price")}
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              inputProps={{ step: "0.01", min: "0.01" }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label={t("products.stock")}
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              inputProps={{ min: "0" }}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label={t("products.category")}
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.isActive}
                  onChange={handleChange}
                  name="isActive"
                  color="success"
                />
              }
              label={t("products.isActive")}
            />
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          {t("common.cancel")}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ bgcolor: "#5CAB7A", "&:hover": { bgcolor: "#4a9b6a" } }}
        >
          {loading
            ? t("common.loading")
            : isEdit
              ? t("common.update")
              : t("common.create")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}