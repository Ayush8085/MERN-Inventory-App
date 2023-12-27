import React from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './ProductForm.css';

const ProductForm = (props) => {
    const { product, productImage, imagePreview, description, setDescription, handleInputChange, handleImageChange, saveProduct } = props;

    return (
        <div>
            <form onSubmit={saveProduct}>
                <div className='product-img'>
                    <label style={{ fontSize: "1.4rem" }}>Product Image</label><br />
                    <code className='code'>Suported formats: .jpg .jpeg .png</code><br />
                    <input type="file" name="image" onChange={(e) => handleImageChange(e)} /><br />

                    {imagePreview != null ? (
                        <img className='image-preview' src={imagePreview} alt="image" />
                    ) : (<p>No image added yet!</p>)}

                </div>

                <div className='product-details'>
                    <label>Product Name:</label>
                    <input type="text" name="name" placeholder='Product name:' value={product?.name} onChange={handleInputChange} />
                </div>

                <div className='product-details'>
                    <label>Product Category:</label>
                    <input type="text" name="category" placeholder='Product category:' value={product?.category} onChange={handleInputChange} />
                </div>

                <div className='product-details'>
                    <label>Product Price:</label>
                    <input type="text" name="price" placeholder='Product price:' value={product?.price} onChange={handleInputChange} />
                </div>

                <div className='product-details'>
                    <label>Product Quantity:</label>
                    <input type="text" name="quantity" placeholder='Product quantity:' value={product?.quantity} onChange={handleInputChange} />
                </div>

                <div className='product-details'>
                    <label>Product Description:</label>
                    <ReactQuill theme="snow" value={description} onChange={setDescription} modules={ProductForm.modules} formats={ProductForm.formats}
                    />
                </div>

                <button type='submit' className='save-btn'>Save Product</button>
            </form>
        </div>
    )
};

ProductForm.modules = {
    toolbar: [
        [{ header: "1" }, { header: "2" }, { font: [] }],
        [{ size: [] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        [{ align: [] }],
        [{ color: [] }, { background: [] }],
        [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
        ],
        ["clean"],
    ],
};
ProductForm.formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "link",
    "video",
    "image",
    "code-block",
    "align",
];

export default ProductForm