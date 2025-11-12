import { AppBar, Box, Button, Menu, MenuItem, Toolbar, Typography } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logout } from "../store/slices/authSlice"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import LanguageIcon from "@mui/icons-material/Language"
import LogoutIcon from "@mui/icons-material/Logout"
import PersonIcon from "@mui/icons-material/Person"

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((s) => s.auth)
  const [anchorEl, setAnchorEl] = useState(null)
  const [langAnchor, setLangAnchor] = useState(null)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
    setAnchorEl(null)
  }

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng)
    setLangAnchor(null)
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: "#5CAB7A",
        top: 0,
        zIndex: 100,
      }}
    >
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          E-Commerce Admin
        </Typography>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {/* Language selector */}
          <Button
            color="inherit"
            startIcon={<LanguageIcon />}
            onClick={(e) => setLangAnchor(e.currentTarget)}
            size="small"
          >
            {i18n.language.toUpperCase()}
          </Button>
          <Menu anchorEl={langAnchor} open={Boolean(langAnchor)} onClose={() => setLangAnchor(null)}>
            <MenuItem onClick={() => changeLanguage("uz")}>Uzbek (UZ)</MenuItem>
            <MenuItem onClick={() => changeLanguage("en")}>English (EN)</MenuItem>
          </Menu>

          <Button
            color="inherit"
            startIcon={<PersonIcon />}
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ textTransform: "none" }}
          >
            {user?.username || "User"}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            <MenuItem onClick={handleLogout} sx={{ color: "#5CAB7A" }}>
              <LogoutIcon sx={{ mr: 1 }} />
              {t("navbar.logout")}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
