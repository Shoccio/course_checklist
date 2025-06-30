import React from "react"
import Logo from "../imgs/uphsllogo.png"
import style from "../style/checklist.module.css"

export default function Checklist(){
    return(
        <div className={style.curChecklist}>
            <header>
                <div className={style.logo}>
                    <img src={Logo} alt="Logo" width="100" height="100"></img>
                    <b>UNIVERSITY OF PERPETUAL HELP SYSTEM LAGUNA</b>
                </div>
                <button className={style.signOut} type="button">SIGN OUT</button>
                <div className={style.banner}>CURRICULUM CHECKLIST</div>
            </header>

            <div className={style.studentBody}>
                <form>
                    <input className={style.searchBar} type="text" placeholder="SEARCH STUDENT..."></input>
                </form>
                <div className={style.studentDetail}>
                    <div className={style.studentEval}>
                        HEYY LISTEN
                    </div>
                </div>
            </div>
        </div>
    );
}