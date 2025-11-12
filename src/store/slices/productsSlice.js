import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  selectedProduct: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 10,
  },
}

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setProducts: (state, action) => {
      state.items = action.payload.content || []
      state.pagination = {
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.number,
        size: action.payload.size,
      }
      state.loading = false
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    addProduct: (state, action) => {
      state.items.push(action.payload)
    },
    updateProduct: (state, action) => {
      const index = state.items.findIndex((p) => p.id === action.payload.id)
      if (index !== -1) {
        state.items[index] = action.payload
      }
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter((p) => p.id !== action.payload)
    },
    clearError: (state) => {
      state.error = null
    },
    resetSelectedProduct: (state) => {
      state.selectedProduct = null
    },
  },
})

export const {
  setLoading,
  setProducts,
  setSelectedProduct,
  setError,
  addProduct,
  updateProduct,
  deleteProduct,
  clearError,
  resetSelectedProduct,
} = productsSlice.actions
export default productsSlice.reducer
