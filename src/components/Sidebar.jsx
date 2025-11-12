import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useTranslation } from "react-i18next";

const drawerWidth = 280;

export default function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((s) => s.auth);

  const menuItems = [
    { label: t("navbar.dashboard"), icon: DashboardIcon, path: "/dashboard" },
    { label: t("navbar.products"), icon: InventoryIcon, path: "/products" },
    { label: t("navbar.orders"), icon: ShoppingCartIcon, path: "/orders" },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: { xs: "none", sm: "block" },
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#5CAB7A",
          color: "white",
          position: "fixed",
          height: "100vh",
          zIndex: 99,
          overflowY: "auto",
        },
      }}
    >
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" sx={{ fontSize: "1.1rem" }}>
          Admin Panel
        </Typography>
      </Box>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.3)" }} />

      <List sx={{ flex: 1, p: 0 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname.startsWith(item.path);

          return (
            <ListItemButton
              key={item.path}
              onClick={() => navigate(item.path)}
              sx={{
                py: 1.5,
                px: 2,
                backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
                borderLeft: isActive ? "4px solid white" : "4px solid transparent",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
                transition: "all 0.2s",
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                <Icon />
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>

      {user && (
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.3)" }}>
          <Typography
            variant="caption"
            sx={{ opacity: 0.8, display: "block", textAlign: "center" }}
          >
            {t("sidebar.user")}: {user.username}
          </Typography>
        </Box>
      )}
    </Drawer>
  );
}