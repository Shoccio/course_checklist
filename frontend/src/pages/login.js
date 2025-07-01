import { useState } from "react";
import logo from "../imgs/uphsllogo.png";
import { useNavigate } from "react-router-dom";
import style from "./../style/login.module.css";
import axios from "axios";

export default function Login() {
    const navigate = useNavigate();
    const [login_id, setLoginID] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const checkCredential = async (username, password) => {
        try {
            const response = await axios.post(
                'http://127.0.0.1:8000/auth/login',
                new URLSearchParams({
                    username,
                    password
                }),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    withCredentials: true
                }
            );

            console.log(response.data);
            setError(""); // Clear any previous errors
            navigate("/checklist");
        } catch (error) {
            console.error('Login failed: ', error.response?.data || error.message);
            setError("Invalid login credentials. Please try again.");
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form from reloading page
        checkCredential(login_id, password);
    };

    return (
        <div className={`${style.page} ${style.loginPage}`}>
            <div className={style.login}>
                <header>
                    <img src={logo} alt="Logo" width="100" height="100" />
                    <b>UNIVERSITY OF PERPETUAL HELP SYSTEM LAGUNA</b>
                </header>
                <div className={style.loginBody}>
                    <div className={`${style.block} ${style.leftBlock}`}>
                        <h1>SIGN IN</h1> <br />
                        <form onSubmit={handleSubmit}>
                            <input
                                className={style.logForm}
                                type="text"
                                id="login_id"
                                name="login_id"
                                value={login_id}
                                placeholder=" STUDENT NUMBER"
                                onChange={(e) => setLoginID(e.target.value)}
                            /> <br />
                            <input
                                className={style.logForm}
                                type="password"
                                id="password"
                                name="password"
                                value={password}
                                placeholder=" PASSWORD"
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Show error below password input */}
                            {error && (
                                <div style={{ color: 'red', marginTop: '10px' }}>
                                    {error}
                                </div>
                            )}

                            <button
                                className={style.logButton}
                                type="submit"
                            >
                                <b>SIGN IN</b>
                            </button>
                        </form>
                    </div>
                    <div className={style.block}>
                        <h1>
                            <span className={style.welcome}>WELCOME!</span><br />
                            <span className={style.perpetualite}>PERPETUALITE</span>
                        </h1>
                    </div>
                </div>
            </div>
        </div>
    );
}
