import react, { useState, useEffect } from "react";
import Logo from "../imgs/uphsllogo.png";
import style from "../style/header.module.css"

export default function HeaderWebsite({ pageName, logOut }){
    const [isDown, setIsDown] = useState(false);

    const setBannerDown = () =>{
        setIsDown(!isDown);
    }

    return(
        <header>
            <div className={style.logo}>
                <b>--UNIVERSITY</b>
            </div>
            <button className={style.signOut} type="button" onClick={logOut}>
                SIGN OUT
            </button>
            <div className={isDown ? `${style.banner} ${style.animated}`  : style.banner}>
                <span>Dashboard</span>
                <span>Program Courselist</span>
                <span>Checklist</span>
                <a onClick={setBannerDown}>{pageName}</a>
            </div>
        </header>
    );
} 