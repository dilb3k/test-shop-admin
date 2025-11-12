import { Box, Container } from "@mui/material"
import Sidebar from "./Sidebar"

export default function PageWrapper({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <Box sx={{ flex: 1, ml: { xs: 0, sm: 280 }, mt: 8, pb: 4 }}>
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  )
}
