import React from "react"
import logo from "../imgs/uphsllogo.png"
import { useNavigate } from "react-router-dom";
import style from "./../style/login.module.css"

export default function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate("/checklist")
    }
    return(
        <div className={`${style.page} ${style.loginPage}`}>
            <div className={style.login}>
                <header>
                    <img src={logo} alt="Logo" width="100" height="100"></img>
                    <b>UNIVERSITY OF PERPETUAL HELP SYSTEM LAGUNA</b>
                </header>
                <div className={style.loginBody}>
                    <div className={`${style.block} ${style.leftBlock}`}>
                        <h1>SIGN IN</h1> <br/>
                        <form>
                            <input className={style.logForm} type="text" id="login_id" name="login_id" placeholder=" EMAIL"></input> <br></br>
                            <input className={style.logForm} type="text" id="password" name="password" placeholder=" PASSWORD"></input>
                        </form>
                        <button className={style.logButton} type="submit" onClick={handleLogin}><b>SIGN IN</b></button>
                    </div>
                    <div className={style.block}>
                        <h1>
                            <span className={style.welcome}>WELCOME!</span><br></br>
                            <span className={style.perpetualite}>PERPETUALITE</span>
                        </h1>
                    </div>
                </div>
                

            </div>
        </div>
    );
}
