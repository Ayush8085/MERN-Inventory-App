const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel');
const { fileSizeFormatter } = require('../utils/fileUpload');


// -------------------- CREATE PRODUCT --------------------
const createProduct = asyncHandler(async (req, res) => {
    const { name, sku, category, quantity, price, description } = req.body;

    if (!name || !category || !quantity || !price || !description) {
        res.status(400);
        throw new Error('Please add all fields!!');
    }

    // Handle image upload 
    let fileData = {}
    if (req.file) {
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    const product = await Product.create({
        user: req.user._id,
        name,
        sku,
        category,
        quantity,
        price,
        description,
        image: fileData,
    });

    res.status(201).json(product);
});

// -------------------- GET ALL PRODUCTS --------------------
const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({ user: req.user._id }).sort("-createdAt");

    res.status(200).json(products);
});

// -------------------- GET PRODUCT --------------------
const getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found!!");
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized!!");
    }

    res.status(200).json(product);
});

// -------------------- DELETE A PRODUCT --------------------
const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found!!");
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized!!");
    }
    await Product.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: "Product deleted successfully!!" });
});

// -------------------- UPDATE PRODUCT --------------------
const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, quantity, price, description } = req.body;
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        res.status(404);
        throw new Error("Product not found!!");
    }

    if (product.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error("User not authorized!!");
    }

    // Handle image upload 
    let fileData = {}
    if (req.file) {
        fileData = {
            fileName: req.file.originalname,
            filePath: req.file.path,
            fileType: req.file.mimetype,
            fileSize: fileSizeFormatter(req.file.size, 2),
        }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        { _id: id },
        {
            name,
            category,
            quantity,
            price,
            description,
            image: Object.keys(fileData).length === 0 ? product.image : fileData,
        },
        {
            new: true,
            runValidators: true
        }
    )

    res.status(200).json(updatedProduct);
});



module.exports = {
    createProduct,
    getProducts,
    getProduct,
    deleteProduct,
    updateProduct,
}