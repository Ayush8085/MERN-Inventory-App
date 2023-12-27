import React from 'react';
import { BiSearch } from 'react-icons/bi';

const Search = ({ value, onChange }) => {
    return (
        <div className='search'>
            <BiSearch size={18} />
            <input type="text" placeholder='Search products' value={value} onChange={onChange} />
        </div>
    )
}

export default Search