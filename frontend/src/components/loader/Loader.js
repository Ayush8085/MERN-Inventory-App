import React from "react";
import ReactDOM from "react-dom";
import LoadingImg from '../../assets/Iphone-spinner-2.gif';

const Loader = () => {
    return ReactDOM.createPortal(
        <div className="wrapper">
            <div>
                <img src={LoadingImg} alt="" />
            </div>
        </div>,
        document.getElementById('loader')
    )
}

export default Loader