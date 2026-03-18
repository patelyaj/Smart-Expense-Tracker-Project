import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../utils/axiosInstance";

export const fetchCategories = createAsyncThunk(
    'category/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/categories/', { 
                withCredentials: true 
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

const categorySlice = createSlice({
    name: 'category',
    initialState: {
        categories: [],
        status: 'idle',
        categoriesFetched: false
    },
    reducers: {
        // NEW: Action to reset the fetch status when a new category is added
        markCategoriesStale: (state) => {
            state.categoriesFetched = false;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.categories = action.payload;
                state.categoriesFetched = true;
            })
            .addCase(fetchCategories.rejected, (state) => { state.status = 'failed'; });
    }
});

export const { markCategoriesStale } = categorySlice.actions; // Export the action
export default categorySlice.reducer;