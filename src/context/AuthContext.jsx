import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/service";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false)
    const [registerError, setRegisterError] = useState(null)
    const [isLoginLoading, setIsLoginLoading] = useState(false)
    const [loginError, setIsLoginError] = useState(null)
    const [registerInfo, setRegisterInfo] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loginInfo, setLoginInfo] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        setUser(JSON.parse(user))
    }, [])

    const registerUser = useCallback(async (e) => {
        e?.preventDefault()
        setIsRegisterLoading(true)
        setRegisterError(null)
        const response = await postRequest(`${baseUrl}/users/register`, JSON.stringify(registerInfo));
        setIsRegisterLoading(false)
        if (response?.error) {
            return setRegisterError(response)
        }
        localStorage.setItem('user', JSON.stringify(response))
        setUser(response)
    }, [registerInfo])

    const loginUser = useCallback(async (e) => {
        e?.preventDefault()
        setIsLoginLoading(true)
        setIsLoginError(null)
        const response = await postRequest(`${baseUrl}/users/login`, JSON.stringify(loginInfo));
        setIsLoginLoading(false)
        if (response?.error) {
            return setIsLoginError(response)
        }
        localStorage.setItem('user', JSON.stringify(response))
        setUser(response)

    }, [loginInfo])

    
    const updateRegisterInfo = useCallback((info) => {
        setRegisterInfo(info)
    }, [])

    const updateLoginInfo = useCallback((info) => {
        setLoginInfo(info)
    }, [])
    const logoutUser = () => {
        localStorage.removeItem('user');
        setUser(null)
    }
    return <AuthContext.Provider value={{ user, registerInfo, updateRegisterInfo, registerUser, registerError, isRegisterLoading, logoutUser,loginError,loginInfo,loginUser,updateLoginInfo,isLoginLoading }}>
        {children}
    </AuthContext.Provider>
}