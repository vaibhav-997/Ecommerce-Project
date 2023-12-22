import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


export default function AdminProtected ({children, admin = false}){
    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const adminUser = useSelector(state => state.auth.userData)
    useEffect(() => {
        setLoader(true)
        if(adminUser.role === "NORMAL" && admin ){
            navigate('/')
        }
        setLoader(false)
    }, [adminUser, navigate, admin])

    return loader ? <h1>Loading....</h1> : <>{children}</>
}