import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("authToken") || null,
  loading: false,
  error: null,
}

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setUser: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.loading = false
      localStorage.setItem("authToken", action.payload.token)
      localStorage.setItem("user", JSON.stringify(action.payload.user))
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.loading = false
      state.error = null
      localStorage.removeItem("authToken")
      localStorage.removeItem("user")
    },
    clearError: (state) => {
      state.error = null
    },
    // Additional reducers can be added here if needed
  },
})

export const { setLoading, setUser, setError, logout, clearError } = authSlice.actions
export default authSlice.reducer
