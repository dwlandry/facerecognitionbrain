import React from 'react';
import './FaceRecognition.css';

const FaceRecognition = ({ imageUrl, boxes }) => {

    const final = [];
    for (let index = 0; index < boxes.length; index++) {
        const element = boxes[index];
        const {top, right, bottom, left} = element;
        
        final.push(<div 
            className='bounding-box' 
            key={index} 
            style ={{top: top, 
                    right: right, 
                    bottom: bottom, 
                    left: left}}>
            </div>);
   }
    
    return (
        <div className='center ma'>
            <div className='absolute mt2'>
                <img 
                    id='inputImage' 
                    alt='' 
                    src={imageUrl} 
                    width='1000px' 
                    height='auto' 
                />
                {final}
            </div>
        </div>
    );
}

export default FaceRecognition;