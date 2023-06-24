import {Parallax, useParallax} from 'react-scroll-parallax'
import { useRef } from 'react';

const MainImg = () =>{

    return (
        <div className="main__img">
            <Parallax speed={-100}>
                <div className="main__img--01">detalle01</div>
            </Parallax>
            <Parallax speed={-200}>
            <div className="main__img--02">icono01</div>
            </Parallax>
            <Parallax speed={-500}>
            <div className="main__img--03">botella</div>
            </Parallax>
            <Parallax speed={-250} >
            <div className="main__img--04">detalle02</div>
            </Parallax>
            <Parallax speed={-100} >
            <div className="main__img--05">icono02</div>
            </Parallax>
        </div>
    )
} 

export default MainImg