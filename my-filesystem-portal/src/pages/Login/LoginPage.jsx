
import '/LoginPage.css'
import React, { useState } from 'react' 
export default function LoginPage() {

    const [action, setAction] = useState("Login")

    return (
        <div className="container">
            <div className="header">
                <div className="text">LOGIN</div>
            </div>
            <div ClassName="info">
                <div className="input">
                    <input type="email" placeholder="Email"></input>
                </div>
                <div className="input">
                    <input type="password" placeholder="Password"></input>
                </div>
            </div>
            <div className="submit">
                <div className={action=="Login"?"submit azure": "submit"} onClick={()=>{setAction("Sign Up")}}>Sign Up</div>
                <div className={action=="Sign Up"?"submit azure": "submit"} onClick={()=>{setAction("Login")}}>Login</div>
            </div>
        </div>
    )
}