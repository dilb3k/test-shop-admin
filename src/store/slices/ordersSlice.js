import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  selectedOrder: null,
  loading: false,
  error: null,
  pagination: {
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 10,
  },
  cartItems: [],
}

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true
      state.error = null
    },
    setOrders: (state, action) => {
      state.items = action.payload.content || []
      state.pagination = {
        totalElements: action.payload.totalElements,
        totalPages: action.payload.totalPages,
        currentPage: action.payload.number,
        size: action.payload.size,
      }
      state.loading = false
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    addOrder: (state, action) => {
      state.items.push(action.payload)
    },
    updateOrderStatus: (state, action) => {
      const index = state.items.findIndex((o) => o.id === action.payload.id)
      if (index !== -1) {
        state.items[index].status = action.payload.status
      }
    },
    deleteOrder: (state, action) => {
      state.items = state.items.filter((o) => o.id !== action.payload)
    },
    addToCart: (state, action) => {
      const existingItem = state.cartItems.find((item) => item.productId === action.payload.productId)
      if (existingItem) {
        existingItem.quantity += action.payload.quantity
      } else {
        state.cartItems.push(action.payload)
      }
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((item) => item.productId !== action.payload)
    },
    clearCart: (state) => {
      state.cartItems = []
    },
    clearError: (state) => {
      state.error = null
    },
    updateCartItem: (state, action) => {
      const item = state.cartItems.find((item) => item.productId === action.payload.productId)
      if (item) {
        item.quantity = action.payload.quantity
        item.totalPrice = item.unitPrice * item.quantity
      }
    },
    // Additional reducers can be added here
  },
})

export const {
  setLoading,
  setOrders,
  setSelectedOrder,
  setError,
  addOrder,
  updateOrderStatus,
  deleteOrder,
  addToCart,
  removeFromCart,
  clearCart,
  clearError,
  updateCartItem,
} = ordersSlice.actions
export default ordersSlice.reducer
