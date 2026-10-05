import {
    useContext,
    useEffect,
    useRef
} from "react";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";

import { MyContext } from "./MyContext.jsx";
import "./Chat.css";

function Chat() {

    const {
        prevChats,
        reply
    } = useContext(MyContext);

    const chatEndRef = useRef(null);

    // Automatically scroll to latest message
   useEffect(() => {

    chatEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end"
    });

}, [prevChats, reply]);


    return (
        <div className="chat">

            {prevChats && prevChats.length > 0 ? (

                <div className="chat-messages">

                    {prevChats.map((chat, index) => (

                        <div
                            key={index}
                            className={
                                chat.role === "user"
                                    ? "chat-row user-row"
                                    : "chat-row assistant-row"
                            }
                        >

                            {chat.role === "assistant" && (
                                <div className="assistant-avatar">
                                    ✦
                                </div>
                            )}

                            <div
                                className={
                                    chat.role === "user"
                                        ? "user-bubble"
                                        : "assistant-content"
                                }
                            >

                                {chat.role === "user" ? (

                                    chat.content

                                ) : (

                                    <ReactMarkdown
                                        rehypePlugins={[
                                            rehypeHighlight
                                        ]}
                                    >
                                        {chat.content}
                                    </ReactMarkdown>

                                )}

                            </div>

                        </div>

                    ))}


                    {/* CURRENT AI RESPONSE */}

                    {reply &&
                        prevChats[prevChats.length - 1]?.content !== reply && (

                            <div className="chat-row assistant-row">

                                <div className="assistant-avatar">
                                    ✦
                                </div>

                                <div className="assistant-content">

                                    <ReactMarkdown
                                        rehypePlugins={[
                                            rehypeHighlight
                                        ]}
                                    >
                                        {reply}
                                    </ReactMarkdown>

                                </div>

                            </div>

                        )}


                    {/* SCROLL TARGET */}

                   

                </div>

            ) : (

                /* WELCOME SCREEN */

                <div className="welcome-screen">

                    <div className="welcome-icon">
                        ✦
                    </div>

                    <h1>
                        What can I help you with?
                    </h1>

                    <p>
                        Ask AuraGPT anything — code, ideas,
                        learning, projects and more.
                    </p>

                    <div className="suggestions">

                        <button>
                            ✦ &nbsp; Explain AI simply
                        </button>

                        <button>
                            ⌘ &nbsp; Help me debug code
                        </button>

                        <button>
                            ✦ &nbsp; Give me project ideas
                        </button>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Chat;