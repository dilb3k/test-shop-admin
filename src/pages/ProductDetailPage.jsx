import {
  Drawer,
  Box,
  Typography,
  Button,
  Chip,
  Divider,
  Avatar,
  Stack,
  IconButton,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import InventoryIcon from "@mui/icons-material/Inventory";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const drawerWidth = 420;

export default function ProductDetailDrawer({ open, onClose, product, onToast, navigate, t }) {
  if (!product) return null;

  const handleDelete = async () => {
    if (!window.confirm(t("products.deleteConfirm"))) return;
    try {
      await productsAPI.delete(product.id);
      onToast?.(t("products.deleteSuccess"), "success");
      onClose();
      navigate("/products");
    } catch (err) {
      onToast?.(err.response?.data?.message || t("common.error"), "error");
    }
  };

  return (
    <Drawer anchor="right" open={open} onClose={onClose} sx={{ "& .MuiDrawer-paper": { width: drawerWidth } }}>
      <Box sx={{ p: 4, height: "100%", overflowY: "auto" }}>
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={onClose} size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight="bold" ml={1}>
            {t("products.detail")}
          </Typography>
        </Box>

        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 140,
              height: 140,
              bgcolor: "#5CAB7A",
              color: "white",
              fontSize: 70,
              fontWeight: "bold",
            }}
          >
            {product.name[0].toUpperCase()}
          </Avatar>
          <Typography variant="h4" fontWeight="bold" mt={2}>
            {product.name}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} mb={2} flexWrap="wrap">
          <Chip label={product.category} color="primary" />
          <Chip
            icon={<InventoryIcon />}
            label={product.stock > 0 ? t("products.inStock") : t("products.outOfStock")}
            color={product.stock > 0 ? "success" : "error"}
          />
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Typography variant="h5" color="#5CAB7A" fontWeight="bold" gutterBottom>
          ${Number(product.price).toFixed(2)}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <CalendarTodayIcon fontSize="small" />
          <Typography>
            {new Date(product.createdAt).toLocaleDateString("uz-UZ", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Typography>
        </Box>

        <Chip
          label={product.isActive ? t("products.active") : t("products.inactive")}
          color={product.isActive ? "success" : "default"}
          sx={{ mb: 4 }}
        />

        <Stack direction="row" spacing={2}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => {
              onClose();
              navigate(`/products/${product.id}/edit`);
            }}
          >
            {t("common.edit")}
          </Button>
          <Button fullWidth variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDelete}>
            {t("common.delete")}
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}