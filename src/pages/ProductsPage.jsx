import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  setLoading,
  setProducts,
  setError,
  deleteProduct,
  addProduct,
  updateProduct,
} from "../store/slices/productsSlice";
import { productsAPI } from "../api/apiService";
import { useTranslation } from "react-i18next";
import useDebounce from "../hooks/useDebounce";
import {
  Container,
  Typography,
  TextField,
  Box,
  InputAdornment,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  Grid,
  FormControlLabel,
  Switch,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ProductDetailDrawer from "./ProductDetailPage";
import PaginationComponent from "../components/PaginationComponent";

export default function ProductsPage({ onToast }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { items, loading, error, pagination } = useSelector((s) => s.products);

  const urlPage = parseInt(searchParams.get("page") || "0", 10);
  const urlSearch = searchParams.get("search") || "";
  const urlCategory = searchParams.get("category") || "";

  const [search, setSearch] = useState(urlSearch);
  const [category, setCategory] = useState(urlCategory);
  const [page, setPage] = useState(urlPage);
  const debouncedSearch = useDebounce(search, 500);
  const debouncedCategory = useDebounce(category, 500);

  const [deleteId, setDeleteId] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "", isActive: true });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fetchingForm, setFetchingForm] = useState(false);
  const isEdit = !!editingId;

  const updateURL = useCallback(
    (p, s, c) => {
      const params = new URLSearchParams();
      if (p > 0) params.set("page", String(p));
      if (s) params.set("search", s);
      if (c) params.set("category", c);
      setSearchParams(params);
    },
    [setSearchParams]
  );

  const fetchProducts = useCallback(
    async (s = "", c = "", p = 0) => {
      dispatch(setLoading());
      try {
        const res = s || c ? await productsAPI.search(s, c, p) : await productsAPI.getAll(p);
        dispatch(setProducts(res.data.data));
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
    setSearch(urlSearch);
    setCategory(urlCategory);
  }, [urlPage, urlSearch, urlCategory]);

  useEffect(() => {
    if (page !== urlPage || debouncedSearch !== urlSearch || debouncedCategory !== urlCategory) {
      updateURL(page, debouncedSearch, debouncedCategory);
    }
  }, [page, urlPage, debouncedSearch, urlSearch, debouncedCategory, urlCategory, updateURL]);

  useEffect(() => {
    fetchProducts(debouncedSearch, debouncedCategory, page);
  }, [debouncedSearch, debouncedCategory, page, fetchProducts]);

  const openForm = (id = null) => {
    setEditingId(id);
    setFormOpen(true);
    setFormError("");
    if (!id) {
      setForm({ name: "", price: "", stock: "", category: "", isActive: true });
    }
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditingId(null);
    setFormError("");
    setFetchingForm(false);
  };

  useEffect(() => {
    if (!isEdit || !formOpen) return;
    setFetchingForm(true);
    productsAPI
      .getById(editingId)
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
        setFormError(msg);
        onToast?.(msg, "error");
      })
      .finally(() => setFetchingForm(false));
  }, [editingId, isEdit, formOpen, t, onToast]);

  const handleFormChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const validateForm = () => {
    if (!form.name.trim()) return t("products.nameRequired");
    if (!form.price || Number(form.price) <= 0) return t("products.priceInvalid");
    if (form.stock === "" || Number(form.stock) < 0) return t("products.stockInvalid");
    if (!form.category.trim()) return t("products.categoryRequired");
    return null;
  };

  const handleFormSubmit = async () => {
    const err = validateForm();
    if (err) {
      setFormError(err);
      return;
    }
    setFormLoading(true);
    setFormError("");
    try {
      let res;
      if (isEdit) {
        res = await productsAPI.update(editingId, form);
        dispatch(updateProduct(res.data.data));
        onToast?.(t("products.updateSuccess"), "success");
      } else {
        res = await productsAPI.create(form);
        dispatch(addProduct(res.data.data));
        onToast?.(t("products.createSuccess"), "success");
      }
      closeForm();
      fetchProducts(debouncedSearch, debouncedCategory, page);
    } catch (err) {
      const msg = err.response?.data?.message || t("common.error");
      setFormError(msg);
      onToast?.(msg, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const openDetail = (product) => {
    setSelectedProduct(product);
    setDetailOpen(true);
  };
  const closeDetail = () => setDetailOpen(false);

  const handleOpenDelete = (id) => {
    setDeleteId(id);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => {
    setOpenDelete(false);
    setDeleteId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await productsAPI.delete(deleteId);
      dispatch(deleteProduct(deleteId));
      onToast?.(t("products.deleteSuccess"), "success");
      if (items.length === 1 && page > 0) setPage(page - 1);
      else fetchProducts(debouncedSearch, debouncedCategory, page);
    } catch (err) {
      onToast?.(err.response?.data?.message || t("common.error"), "error");
    } finally {
      setDeleting(false);
      handleCloseDelete();
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          {t("products.title")}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openForm()}
          sx={{ bgcolor: "#5CAB7A", "&:hover": { bgcolor: "#4a9b6a" }, px: 3, fontWeight: 600 }}
        >
          {t("products.addNew")}
        </Button>
      </Box>

      <Grid container spacing={2} mb={3} alignItems="center">
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={t("products.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <TextField
            fullWidth
            size="small"
            placeholder={t("products.category")}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </Grid>
      </Grid>

      {loading && (
        <Box textAlign="center" py={8}>
          <CircularProgress />
          <Typography mt={2}>{t("common.loading")}</Typography>
        </Box>
      )}
      {error && !loading && <Alert severity="error">{error}</Alert>}
      {!loading && !error && items.length === 0 && (
        <Alert severity="info">
          {search || category ? t("products.tryDifferent") : t("products.noCatalog")}
        </Alert>
      )}

      {!loading && items.length > 0 && (
        <>
          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ bgcolor: "#5CAB7A" }}>
                <TableRow>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("products.name")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("products.category")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="right">
                    {t("products.price")}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    {t("products.stock")}
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }}>{t("products.status")}</TableCell>
                  <TableCell sx={{ color: "white", fontWeight: "bold" }} align="center">
                    {t("common.actions")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((p) => (
                  <TableRow key={p.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                    <TableCell>{p.category}</TableCell>
                    <TableCell align="right" sx={{ color: "#5CAB7A", fontWeight: "bold" }}>
                      ${Number(p.price).toFixed(2)}
                    </TableCell>
                    <TableCell align="center">
                      <Chip label={p.stock} color={p.stock > 0 ? "success" : "error"} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={p.isActive ? t("products.active") : t("products.inactive")}
                        color={p.isActive ? "success" : "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="primary" onClick={() => openDetail(p)} size="small">
                        <VisibilityIcon />
                      </IconButton>
                      <IconButton color="info" onClick={() => openForm(p.id)} size="small">
                        <EditIcon />
                      </IconButton>
                      <IconButton color="error" onClick={() => handleOpenDelete(p.id)} size="small">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <PaginationComponent currentPage={page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}

      <Dialog open={openDelete} onClose={handleCloseDelete}>
        <DialogTitle>{t("products.deleteConfirm")}</DialogTitle>
        <DialogContent>{t("products.deleteWarning")}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete} disabled={deleting}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
            {deleting ? t("common.loading") : t("common.delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <ProductDetailDrawer
        open={detailOpen}
        onClose={closeDetail}
        product={selectedProduct}
        onToast={onToast}
        navigate={navigate}
        t={t}
      />

      <Dialog open={formOpen} onClose={closeForm} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {isEdit ? t("products.editProduct") : t("products.newProduct")}
          </Typography>
        </DialogTitle>
        {fetchingForm ? (
          <DialogContent sx={{ textAlign: "center", py: 4 }}>
            <CircularProgress />
          </DialogContent>
        ) : (
          <>
            <DialogContent dividers>
              {formError && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setFormError("")}>
                  {formError}
                </Alert>
              )}
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t("products.name")}
                    name="name"
                    value={form.name}
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
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
                    onChange={handleFormChange}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={form.isActive}
                        onChange={handleFormChange}
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
              <Button onClick={closeForm} disabled={formLoading}>
                {t("common.cancel")}
              </Button>
              <Button
                onClick={handleFormSubmit}
                variant="contained"
                disabled={formLoading}
                startIcon={formLoading ? <CircularProgress size={20} /> : null}
                sx={{ bgcolor: "#5CAB7A", "&:hover": { bgcolor: "#4a9b6a" } }}
              >
                {formLoading ? t("common.loading") : isEdit ? t("common.update") : t("common.create")}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
}