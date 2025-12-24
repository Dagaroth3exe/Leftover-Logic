import React from "react";
import Logo from '../assets/Logo.png'
import ProgressBar from "../Components/ProgressBar";

const LoadingScreen =()=>{
    return(
        <>
        <div className="min-h-screen bg-blue-200 flex items-center justify-center flex-col">
            <img
                    src={Logo}
                    alt="Company Logo"
                    className="pointer-events-none"
                    style={{ width: "900px", transform: "translateY(-130px)" }}
            />
            <h1 className="font-semibold">IS COOKING</h1>
            <ProgressBar/>

        </div>
        </>
    )
}

export default LoadingScreen;