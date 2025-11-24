import react, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../imgs/uphsllogo.png";
import style from "../style/header.module.css"

export default function HeaderWebsite({ pageName, logOut }){
    const navigate = useNavigate();
    const [isDown, setIsDown] = useState(false);
    const pageList = [
        { link: "Dashboard" }, 
        { link: "Program Courselist"}, 
        { link: "Curriculum Checklist"}];

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
                {
                    pageList.map(page =>
                        pageName.toLowerCase() !== page.link.toLowerCase() &&
                        <a key={page.link} onClick={() => navigate("/" + page.link.toLowerCase().replace(" ", "-"))}>{page.link}</a>
                    )
                }
                <a onClick={setBannerDown}>{pageName}</a>
            </div>
        </header>
    );
} 