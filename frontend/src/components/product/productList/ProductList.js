import React, { useEffect, useState } from 'react'
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from '../../search/Search';
import { useSelector, useDispatch } from 'react-redux'
import { FILTER_PRODUCTS, selectFilteredPoducts } from '../../../redux/features/product/filterSlice';
import ReactPaginate from 'react-paginate';
import './productList.css';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css';
import { deleteProduct, getProducts } from '../../../redux/features/product/productSlice';


const ProductList = ({ products, isLoading }) => {
    const [search, setSearch] = useState('');
    const filteredProducts = useSelector(selectFilteredPoducts);

    const dispatch = useDispatch();

    const shortenText = (text, n) => {
        if (text.length > n) {
            const shortenedText = text.substring(0, n).concat("...");
            return shortenedText;
        }
        return text;
    };

    const delProduct = async (id) => {
        await dispatch(deleteProduct(id));
        await dispatch(getProducts());
    };

    const confirmDelete = (id) => {
        confirmAlert({
            title: 'Delete Product',
            message: 'Are you sure you want to delete this product.',
            buttons: [
                {
                    label: 'Delete',
                    onClick: () => delProduct(id)
                },
                {
                    label: 'Cancel',
                    // onClick: () => alert('Click No')
                }
            ]
        });
    };

    // Begin pagination

    const [itemOffset, setItemOffset] = useState(0);
    const itemsPerPage = 1;
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = filteredProducts.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % filteredProducts.length;
        setItemOffset(newOffset);
    }

    // End pagination

    useEffect(() => {
        dispatch(FILTER_PRODUCTS({ products, search }));
    }, [products, search, dispatch]);

    return (
        <div className='product-list'>
            <div className="top">
                <h3>Inventory Items</h3>
                <Search value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>

            {/* {isLoading && <Loading/>} */}
            <div className='down'>
                {!isLoading && products.length === 0 ? (
                    <p>-- No products found, please add a product --</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>SN.</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Value</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                currentItems.map((product, index) => {
                                    const { _id, name, category, price, quantity } = product;
                                    return (
                                        <tr key={_id}>
                                            <td>{index + 1}</td>
                                            <td>{shortenText(name, 15)}</td>
                                            <td>{category}</td>
                                            <td>{"$"}{price}</td>
                                            <td>{quantity}</td>
                                            <td>{"$"}{price * quantity}</td>
                                            <td className='icons'>
                                                <span>
                                                    <AiOutlineEye size={25} color={"purple"} />
                                                </span>
                                                <span>
                                                    <FaEdit size={20} color={"green"} />
                                                </span>
                                                <span>
                                                    <FaTrashAlt size={20} color={"red"} onClick={() => { confirmDelete(_id) }} />
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                )}
            </div>
            {/* <ReactPaginate
                breakLabel="..."
                nextLabel="Next>"
                onPageChange={handlePageClick}
                pageRangeDisplayed={1}
                pageCount={pageCount}
                previousLabel="Prev"
                renderOnZeroPageCount={null}
            /> */}
            <ReactPaginate
                breakLabel="..."
                nextLabel="Next"
                onPageChange={handlePageClick}
                pageRangeDisplayed={1}
                pageCount={pageCount}
                previousLabel="Prev"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageLinkClassName="page-num"
                previousLinkClassName="page-num"
                nextLinkClassName="page-num"
                activeLinkClassName="activePage"
            />
        </div>
    )
}

export default ProductList;