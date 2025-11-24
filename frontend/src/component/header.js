import react, { useState, useEffect } from "react";
import { FaArrowCircleDown, FaArrowCircleUp } from "react-icons/fa";
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
            <div className={isDown ? `${style.center} ${style.animated}` : style.center}>
                <div className={style.banner}>
                    {
                        pageList.map(page =>
                            pageName.toLowerCase() !== page.link.toLowerCase() &&
                            <a key={page.link} onClick={() => navigate("/" + page.link.toLowerCase().replace(" ", "-"))}>{page.link}</a>
                        )
                    }
                    {pageName}
                </div>
                <div className={style.drop_icon}>
                    {isDown ? FaArrowCircleUp({ onClick: setBannerDown }) :
                              FaArrowCircleDown({ onClick: setBannerDown })}
                </div>

            </div>
            <button className={style.signOut} type="button" onClick={logOut}>
                SIGN OUT
            </button>
            
            
        </header>
    );
} 