import { useState, useEffect } from "react";
import "./App.css";

import Sidebar from "./Sidebar.jsx";
import ChatWindow from "./ChatWindow.jsx";
import Login from "./Login.jsx";
import Register from "./Register.jsx";

import { MyContext } from "./MyContext.jsx";
import { v1 as uuidv1 } from "uuid";

function App() {

    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [showRegister, setShowRegister] = useState(false);

    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );

    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);

    const [currThreadId, setCurrThreadId] =
        useState(uuidv1());

    const [prevChats, setPrevChats] = useState([]);

    const [newChat, setNewChat] = useState(true);

    const [allThreads, setAllThreads] = useState([]);

    /* =============================== */
    /* THEME */
    /* =============================== */

    useEffect(() => {

        document.body.className = theme;

        localStorage.setItem(
            "theme",
            theme
        );

    }, [theme]);


    /* =============================== */
    /* CHECK AUTH */
    /* =============================== */

    const checkAuth = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/auth/me",
                {
                    credentials: "include"
                }
            );

            if (!response.ok) {

                setUser(null);

                return;
            }

            const data =
                await response.json();

            setUser(data.user);

        } catch (err) {

            console.log(
                "Authentication check failed:",
                err
            );

            setUser(null);

        } finally {

            setAuthLoading(false);

        }
    };


    /* =============================== */
    /* FETCH THREADS */
    /* =============================== */

    const fetchThreads = async () => {

        try {

            const response = await fetch(
                "http://localhost:8080/api/thread",
                {
                    credentials: "include"
                }
            );

            if (!response.ok) return;

            const data =
                await response.json();

            setAllThreads(data);

        } catch (err) {

            console.log(
                "Failed to fetch threads:",
                err
            );

        }
    };


    /* =============================== */
    /* LOAD THREAD */
    /* =============================== */

    const loadThread = async (
        threadId
    ) => {

        try {

            const response = await fetch(
                `http://localhost:8080/api/thread/${threadId}`,
                {
                    credentials: "include"
                }
            );

            const data =
                await response.json();

            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to load thread"
                );

            }

            setPrevChats(data);

            setCurrThreadId(threadId);

            setNewChat(false);

            setReply(null);

        } catch (err) {

            console.log(
                "Failed to load thread:",
                err
            );

        }
    };


    /* =============================== */
    /* NEW CHAT */
    /* =============================== */

    const handleNewChat = () => {

        setCurrThreadId(
            uuidv1()
        );

        setPrevChats([]);

        setReply(null);

        setPrompt("");

        setNewChat(true);

    };


    /* =============================== */
    /* AUTH INIT */
    /* =============================== */

    useEffect(() => {

        checkAuth();

    }, []);


    /* =============================== */
    /* LOAD THREADS AFTER LOGIN */
    /* =============================== */

    useEffect(() => {

        if (user) {

            fetchThreads();

        }

    }, [user]);


    /* =============================== */
    /* LOGIN */
    /* =============================== */

    const handleLogin = (
        loggedInUser
    ) => {

        setUser(loggedInUser);

        setShowRegister(false);

    };


    /* =============================== */
    /* LOGOUT */
    /* =============================== */

    const handleLogout = async () => {

        try {

            await fetch(
                "http://localhost:8080/api/auth/logout",
                {
                    method: "POST",
                    credentials: "include"
                }
            );

        } catch (err) {

            console.log(
                "Logout error:",
                err
            );

        }

        setUser(null);

        setAllThreads([]);

        setPrevChats([]);

        setReply(null);

        setPrompt("");

        setNewChat(true);

    };


    /* =============================== */
    /* REGISTER */
    /* =============================== */

    const handleRegister = () => {

        setShowRegister(false);

    };


    /* =============================== */
    /* LOADING */
    /* =============================== */

    if (authLoading) {

        return (
            <div className="authLoading">

                <div className="loading-aura">
                    <div className="aura-symbol">
                        ✦
                    </div>
                </div>

                <h2>
                    AuraGPT
                </h2>

                <p>
                    Preparing your AI workspace...
                </p>

            </div>
        );

    }


    /* =============================== */
    /* REGISTER */
    /* =============================== */

    if (
        !user &&
        showRegister
    ) {

        return (
            <Register
                onRegister={
                    handleRegister
                }
                onLogin={() =>
                    setShowRegister(false)
                }
            />
        );

    }


    /* =============================== */
    /* LOGIN */
    /* =============================== */

    if (!user) {

        return (
            <Login
                onLogin={handleLogin}
                onRegister={() =>
                    setShowRegister(true)
                }
            />
        );

    }


    /* =============================== */
    /* CONTEXT */
    /* =============================== */

    const providerValues = {

        user,

        theme,
        setTheme,

        prompt,
        setPrompt,

        reply,
        setReply,

        currThreadId,
        setCurrThreadId,

        newChat,
        setNewChat,

        prevChats,
        setPrevChats,

        allThreads,
        setAllThreads,

        loadThread,
        fetchThreads,

        handleNewChat,
        handleLogout
    };


    return (

        <div
            className={`app ${theme}`}
        >

            <MyContext.Provider
                value={providerValues}
            >

                <Sidebar />

                <ChatWindow />

            </MyContext.Provider>

        </div>

    );

}

export default App;