import "./Sidebar.css";

import {
    useContext,
    useState
} from "react";

import {
    MyContext
} from "./MyContext.jsx";


function Sidebar() {

    const {

        allThreads,

        handleNewChat,

        loadThread,

        user,

        handleLogout,

        theme,

        setTheme,

        currThreadId,

        fetchThreads

    } = useContext(MyContext);


    const [showMenu, setShowMenu] =
        useState(false);


    const toggleTheme = () => {

        setTheme(
            theme === "dark"
                ? "light"
                : "dark"
        );

    };


    const deleteChat = async (
        e,
        threadId
    ) => {

        e.stopPropagation();


        const confirmDelete =
            window.confirm(
                "Delete this chat?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            const response =
                await fetch(
                    `http://localhost:8080/api/thread/${threadId}`,
                    {
                        method: "DELETE",
                        credentials: "include"
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to delete chat"
                );

            }


            await fetchThreads();


            if (
                currThreadId ===
                threadId
            ) {

                handleNewChat();

            }

        } catch (err) {

            console.log(
                "Delete Chat Error:",
                err
            );

            alert(
                "Failed to delete chat"
            );

        }

    };


    return (

        <aside className="sidebar">


            {/* ========================= */}
            {/* BRAND */}
            {/* ========================= */}

            <div className="sidebar-brand">

                <div className="aura-logo">
                    ✦
                </div>

                <div className="brand-text">

                    <h2>
                        Aura<span>GPT</span>
                    </h2>

                    <p>
                        AI Workspace
                    </p>

                </div>

            </div>


            {/* ========================= */}
            {/* NEW CHAT */}
            {/* ========================= */}

            <button
                className="new-chat-button"
                onClick={handleNewChat}
            >

                <span className="new-chat-left">

                    <span className="new-chat-icon">
                        <i className="fa-solid fa-plus"></i>
                    </span>

                    <span>
                        New Chat
                    </span>

                </span>


                <i className="fa-solid fa-pen"></i>

            </button>


            {/* ========================= */}
            {/* HISTORY TITLE */}
            {/* ========================= */}

            <div className="history-heading">

                <span>
                    YOUR CHATS
                </span>

                <i className="fa-regular fa-clock"></i>

            </div>


            {/* ========================= */}
            {/* HISTORY */}
            {/* ========================= */}

            <ul className="history">

                {allThreads
                    ?.filter(
                        thread =>
                            thread.title !==
                            "Testing New Thread"
                    )
                    .map(
                        (thread) => (

                            <li
                                key={
                                    thread.threadId
                                }
                                className={
                                    thread.threadId ===
                                    currThreadId
                                        ? "history-item active-thread"
                                        : "history-item"
                                }
                                onClick={() =>
                                    loadThread(
                                        thread.threadId
                                    )
                                }
                            >

                                <div className="thread-icon">

                                    <i className="fa-regular fa-message"></i>

                                </div>


                                <span className="thread-title">

                                    {
                                        thread.title
                                    }

                                </span>


                                <button
                                    className="delete-chat"
                                    onClick={(e) =>
                                        deleteChat(
                                            e,
                                            thread.threadId
                                        )
                                    }
                                    title="Delete chat"
                                >

                                    <i className="fa-solid fa-trash"></i>

                                </button>

                            </li>

                        )
                    )}

            </ul>


            {/* ========================= */}
            {/* BOTTOM */}
            {/* ========================= */}

            <div className="sidebar-bottom">


                <button
                    className="profile-sidebar"
                    onClick={() =>
                        setShowMenu(
                            !showMenu
                        )
                    }
                >

                    <span className="sidebar-avatar">

                        {user?.name
                            ?.charAt(0)
                            ?.toUpperCase() ||
                            "U"}

                    </span>


                    <span className="sidebar-user-info">

                        <strong>
                            {user?.name ||
                                "User"}
                        </strong>

                        <small>
                            Free Account
                        </small>

                    </span>


                    <i
                        className={`fa-solid fa-chevron-up ${
                            showMenu
                                ? "rotate-arrow"
                                : ""
                        }`}
                    ></i>

                </button>


                {/* ========================= */}
                {/* MENU */}
                {/* ========================= */}

                {showMenu && (

                    <div className="sidebar-menu">

                        <button
                            className="sidebar-menu-item"
                            onClick={
                                toggleTheme
                            }
                        >

                            <i
                                className={
                                    theme ===
                                    "dark"
                                        ? "fa-solid fa-sun"
                                        : "fa-solid fa-moon"
                                }
                            ></i>

                            <span>
                                {theme ===
                                "dark"
                                    ? "Light Mode"
                                    : "Dark Mode"}
                            </span>

                        </button>


                        <button
                            className="sidebar-menu-item"
                            onClick={() =>
                                alert(
                                    "Settings coming soon!"
                                )
                            }
                        >

                            <i className="fa-solid fa-gear"></i>

                            <span>
                                Settings
                            </span>

                        </button>


                        <button
                            className="sidebar-menu-item upgrade"
                            onClick={() =>
                                alert(
                                    "Upgrade Plan coming soon!"
                                )
                            }
                        >

                            <i className="fa-solid fa-crown"></i>

                            <span>
                                Upgrade Plan
                            </span>

                        </button>


                        <button
                            className="sidebar-menu-item logout"
                            onClick={
                                handleLogout
                            }
                        >

                            <i className="fa-solid fa-right-from-bracket"></i>

                            <span>
                                Log Out
                            </span>

                        </button>

                    </div>

                )}

            </div>


            <div className="sidebar-footer">

                <span className="footer-dot"></span>

                AuraGPT

                <span>
                    •
                </span>

                Made by Priyanka

            </div>

        </aside>

    );

}

export default Sidebar;