import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import productService from "./productService";
import { toast } from "react-toastify";

const initialState = {
    product: null,
    products: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
    totalStoreValue: 0,
    outOfStock: 0,
    category: [],
}

// CREATE NEW PRODUCT
export const createProduct = createAsyncThunk(
    "products/create",
    async (formData, thunkAPI) => {
        try {
            return await productService.createProduct(formData);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

// GET PRODUCTS
export const getProducts = createAsyncThunk(
    "products/getAll",
    async (_, thunkAPI) => {
        try {
            return await productService.getProducts();
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)


// DELETE PRODUCT
export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (id, thunkAPI) => {
        try {
            return await productService.deleteProduct(id);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            console.log(message);
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        CALC_STORE_VALUE(state, action) {
            const products = action.payload;
            const array = [];
            products.map((item) => {
                const { price, quantity } = item;
                const productValue = price * quantity;
                return array.push(productValue);
            });
            let totalValue = 0;
            if (array.length > 0) {
                totalValue = array.reduce((a, b) => {
                    return a + b;
                });
            }
            state.totalStoreValue = totalValue;
        },
        CALC_OUT_OF_STOCK(state, action) {
            const products = action.payload;
            let count = 0;
            products.map((item) => {
                const { quantity } = item;
                if (quantity === 0 || quantity === '0') return count += 1;
                return;
            })
            state.outOfStock = count;
        },
        CALC_CATEGORY(state, action) {
            const products = action.payload;
            const set = new Set();
            let count = 0;
            products.map((item) => {
                const { category } = item;
                if (!set.has(category)) {
                    count += 1;
                    set.add(category);
                };
            });
            state.category = count;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                console.log(action.payload);
                state.products.push(action.payload);
                toast.success('Product added successfully!!');
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                console.log(action.payload);
                state.products = action.payload;
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                toast.success("Product deleted successfully!!");
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                toast.error(action.payload);
            })
    }
})

export const { CALC_STORE_VALUE, CALC_OUT_OF_STOCK, CALC_CATEGORY } = productSlice.actions;

export const selectIsLoading = (state) => state.product.isLoading;
export const selectTotalStoreValue = (state) => state.product.totalStoreValue;
export const selectOutOfStock = (state) => state.product.outOfStock;
export const selectCategory = (state) => state.product.category;

export default productSlice.reducer;