import React from "react";
import Logo from "../imgs/uphsllogo.png";
import style from "../style/checklist.module.css";
import { useNavigate } from "react-router-dom";

export default function Checklist(){
    const navigate = useNavigate();

    const signOut = () =>{
        navigate("/")
    }
    return(
        <div className={style.curChecklist}>
            <header>
                <div className={style.logo}>
                    <img src={Logo} alt="Logo" width="100" height="100"></img>
                    <b>UNIVERSITY OF PERPETUAL HELP SYSTEM LAGUNA</b>
                </div>
                <button className={style.signOut} type="button" onClick={signOut}>SIGN OUT</button>
                <div className={style.banner}>CURRICULUM CHECKLIST</div>
            </header>

            <div className={style.studentBody}>
                <form>
                    <input className={style.searchBar} type="text" placeholder="SEARCH STUDENT..."></input>
                </form>
                <div className={style.studentDetail}>
                    <h3>STUDENT RESIDENCY EVALUATION</h3>
                    <div className={style.studentResidency}>
                        <div className={style.lBlock}>
                            <span>Student ID:</span>
                            <span>Student Name:</span>
                            <span>Program/Major:</span>
                            <span>Total Units Required for this Course:</span>
                        </div>
                        <div className={style.rBlock}>
                            <span>Year:</span>
                            <span>Status:</span>
                            <span>Total Units Taken:</span>
                            <span>GWA:</span>
                        </div>
                    </div>

                    <h3>Curriculum Residency Evaluation</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>SUB CODE</th>
                                <th>SUB DESCRIPTION</th>
                                <th>TOTAL UNIT</th>
                                <th>CREDIT EARNED</th>
                                <th>GRADE</th>
                                <th>REMARK</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className={style.yearSem}>
                                <td>1ST YEAR 1ST SEM</td>
                            </tr>
                            <tr>
                                <td>BCS1101</td>
                                <td>DISCRETE STRUCTURES</td>
                                <td>3.0(UNIT)</td>
                                <td>3</td>
                                <td>1.0</td>
                                <td>PASSED</td>
                            </tr>
                            <tr>
                                <td>BCS1101</td>
                                <td>DISCRETE STRUCTURES</td>
                                <td>3.0(UNIT)</td>
                                <td>3</td>
                                <td>1.0</td>
                                <td>PASSED</td>
                            </tr>
                            <tr>
                                <td>BCS1101</td>
                                <td>DISCRETE STRUCTURES</td>
                                <td>3.0(UNIT)</td>
                                <td>3</td>
                                <td>1.0</td>
                                <td>PASSED</td>
                            </tr>
                            <tr>
                                <td>BCS1101</td>
                                <td>DISCRETE STRUCTURES</td>
                                <td>3.0(UNIT)</td>
                                <td>3</td>
                                <td>1.0</td>
                                <td>PASSED</td>
                            </tr>
                            <tr>
                                <td>BCS1101</td>
                                <td>DISCRETE STRUCTURES</td>
                                <td>3.0(UNIT)</td>
                                <td>3</td>
                                <td>1.0</td>
                                <td>PASSED</td>
                            </tr>
                            <tr>
                                <td>BCS1101</td>
                                <td>DISCRETE STRUCTURES</td>
                                <td>3.0(UNIT)</td>
                                <td>3</td>
                                <td>1.0</td>
                                <td>PASSED</td>
                            </tr>
                            <tr>
                                <td>BCS1101</td>
                                <td>DISCRETE STRUCTURES</td>
                                <td>3.0(UNIT)</td>
                                <td>3</td>
                                <td>1.0</td>
                                <td>PASSED</td>
                            </tr>
                            
                            
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}