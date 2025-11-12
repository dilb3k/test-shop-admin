import { Card, CardContent, CardActions, Typography, Button, Box, Chip } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

export default function ProductCard({ product, onDelete, isAdmin, onToast }) {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "2px solid #f0f0f0",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
          borderColor: "#5CAB7A",
        },
      }}
    >
      <Box
        sx={{
          backgroundColor: "#5CAB7A",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h3" sx={{ color: "white", opacity: 0.3 }}>
          {product.name.charAt(0).toUpperCase()}
        </Typography>
      </Box>

      <CardContent sx={{ flex: 1 }}>
        <Typography gutterBottom variant="h6" component="div" noWrap sx={{ fontWeight: "bold", color: "#333" }}>
          {product.name}
        </Typography>

        <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
          {t("products.category")}: {product.category}
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ color: "#5CAB7A", fontWeight: "bold" }}>
            ${product.price.toFixed(2)}
          </Typography>
          <Chip
            label={`${product.stock} ${t("products.stock")}`}
            color={product.stock > 0 ? "success" : "error"}
            size="small"
          />
        </Box>

        {!product.isActive && <Chip label={t("products.inactive")} size="small" sx={{ mt: 1 }} />}
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between" }}>
        <Button size="small" onClick={() => navigate(`/products/${product.id}`)} sx={{ color: "#5CAB7A" }}>
          {t("common.view")}
        </Button>
        {isAdmin && (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <Button
              size="small"
              startIcon={<EditIcon />}
              onClick={() => navigate(`/products/${product.id}/edit`)}
              sx={{ color: "#5CAB7A" }}
            >
              {t("common.edit")}
            </Button>
            <Button size="small" startIcon={<DeleteIcon />} onClick={onDelete} sx={{ color: "#d32f2f" }}>
              {t("common.delete")}
            </Button>
          </Box>
        )}
      </CardActions>
    </Card>
  )
}
