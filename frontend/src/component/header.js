import { react } from "react";
import Logo from "../imgs/uphsllogo.png";
import style from "../style/header.module.css"

export default function HeaderWebsite({ pageName, logOut }){
    return(
        <header>
            <div className={style.logo}>
                <b>--UNIVERSITY</b>
            </div>
            <button className={style.signOut} type="button" onClick={logOut}>
                SIGN OUT
            </button>
            <div className={style.banner}>{pageName}</div>
        </header>
    );
} 