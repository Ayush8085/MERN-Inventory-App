import React from 'react';
import './infoBox.css';

const InfoBox = ({ bgColor, title, count, icon }) => {
    return (
        <div className={'info-box'} style={{background: `${bgColor}`}}>
            <span>{icon}</span>
            <span className='right-info-box'>
                <p>{title}</p>
                <h2>{count}</h2>
            </span>
        </div>
    )
}

export default InfoBox;