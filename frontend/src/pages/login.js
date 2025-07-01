import { useState} from "react";
import logo from "../imgs/uphsllogo.png";
import { useNavigate } from "react-router-dom";
import style from "./../style/login.module.css";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [login_id, setLoginID] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        navigate("/checklist")
    }

    const checkCredential = async (username, password) => {
        try{
            const response = await axios.post('http://127.0.0.1:8000/auth/login',
                new URLSearchParams({
                    username,
                    password
                }),
                {
                    headers:{
                    'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    withCredentials: true
                }
            );

            console.log(response.data)
        } catch(error){
            console.error('Login failed: ', error.response?.data || error.message);
        }
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
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input className={style.logForm} 
                                   type="text" 
                                   id="login_id" 
                                   name="login_id" 
                                   value={login_id}  
                                   placeholder=" STUDENT NUMBER" 
                                   onChange={(e) => setLoginID(e.target.value)}>
                            </input> <br></br>
                            <input className={style.logForm} 
                                   type="text" 
                                   id="password" 
                                   name="password" 
                                   value={password} 
                                   placeholder=" PASSWORD"
                                   onChange={(e) => setPassword(e.target.value)}></input>
                        </form>
                        <button className={style.logButton} 
                        type="submit" onClick={() => checkCredential(login_id, password)}><b>SIGN IN</b></button>

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
