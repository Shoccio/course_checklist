import { react } from "react";
import style from "../style/loadingOverlay.module.css";


export default function LoadingOverlay(){
    return(
        <div className={style.screen}>
            Updating...
        </div>
    );
}