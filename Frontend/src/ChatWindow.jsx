import {
    useContext,
    useState,
    useEffect,
    useRef
} from "react";

import "./ChatWindow.css";

import Chat from "./Chat.jsx";

import { MyContext } from "./MyContext.jsx";

import { ScaleLoader } from "react-spinners";


function ChatWindow() {

    const {

        prompt,
        setPrompt,

        reply,
        setReply,

        currThreadId,

        setPrevChats,

        fetchThreads,

        setNewChat,

        theme

    } = useContext(MyContext);


    const [loading, setLoading] =
        useState(false);

    const [isListening, setIsListening] =
        useState(false);


    // Scrollable chat area
    const chatContainerRef = useRef(null);


    // =========================
    // SEND MESSAGE
    // =========================

    const getReply = async () => {

        if (!prompt.trim()) {
            return;
        }

        setLoading(true);

        setNewChat(false);


        const options = {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            credentials: "include",

            body: JSON.stringify({

                message: prompt,

                threadId: currThreadId

            })

        };


        try {

            const response = await fetch(
                "http://localhost:8080/api/chat",
                options
            );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.error ||
                    "Failed to get response"
                );

            }


            setReply(data.reply);

            await fetchThreads();


        } catch (err) {

            console.log(
                "Chat Error:",
                err
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // STORE CHAT
    // =========================

    useEffect(() => {

        if (prompt && reply) {

            setPrevChats(
                prevChats => [

                    ...prevChats,

                    {
                        role: "user",
                        content: prompt
                    },

                    {
                        role: "assistant",
                        content: reply
                    }

                ]
            );

        }

        setPrompt("");

    }, [reply]);


    // =========================
    // AUTO SCROLL
    // =========================

    useEffect(() => {

        const container =
            chatContainerRef.current;

        if (!container) {
            return;
        }

        container.scrollTo({
            top: container.scrollHeight,
            behavior: "smooth"
        });

    }, [reply, loading]);


    // =========================
    // VOICE INPUT
    // =========================

    const startVoiceInput = () => {

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;


        if (!SpeechRecognition) {

            alert(
                "Voice input is not supported in this browser. Please use Chrome."
            );

            return;

        }


        const recognition =
            new SpeechRecognition();


        recognition.lang = "en-IN";

        recognition.continuous = false;

        recognition.interimResults = false;


        recognition.onstart = () => {

            setIsListening(true);

        };


        recognition.onresult = (event) => {

            const transcript =
                event.results[0][0].transcript;

            setPrompt(transcript);

        };


        recognition.onerror = (event) => {

            console.log(
                "Voice Error:",
                event.error
            );

            setIsListening(false);

        };


        recognition.onend = () => {

            setIsListening(false);

        };


        recognition.start();

    };


    // =========================
    // READ RESPONSE
    // =========================

    const speakReply = () => {

        if (!reply) {
            return;
        }


        if (!window.speechSynthesis) {

            alert(
                "Text-to-speech is not supported in this browser."
            );

            return;

        }


        window.speechSynthesis.cancel();


        const speech =
            new SpeechSynthesisUtterance(
                reply
            );


        speech.lang = "en-IN";

        speech.rate = 1;

        speech.pitch = 1;


        window.speechSynthesis.speak(
            speech
        );

    };


    // =========================
    // STOP SPEAKING
    // =========================

    const stopSpeaking = () => {

        window.speechSynthesis.cancel();

    };


    return (

        <div
            className={`chatWindow ${theme}`}
        >

            {/* ========================= */}
            {/* NAVBAR */}
            {/* ========================= */}

            <div className="navbar">

                <span>

                    AuraGPT

                    <i className="fa-duotone fa-solid fa-circle-chevron-down"></i>

                </span>

            </div>


            {/* ========================= */}
            {/* SCROLLABLE CHAT AREA */}
            {/* ========================= */}

            <div
                className="chat-scroll-area"
                ref={chatContainerRef}
            >

                {loading && (

                    <div className="loader">

                        <ScaleLoader
                            color={
                                theme === "dark"
                                    ? "#ffffff"
                                    : "#222222"
                            }
                        />

                    </div>

                )}

                <Chat />

            </div>


            {/* ========================= */}
            {/* INPUT AREA */}
            {/* ========================= */}

            <div className="chatInput">

                <div className="userInput">


                    {/* VOICE */}

                    <button
                        className={`voiceButton ${
                            isListening
                                ? "listening"
                                : ""
                        }`}
                        onClick={
                            startVoiceInput
                        }
                        title="Voice input"
                    >

                        <i className="fa-solid fa-microphone"></i>

                    </button>


                    {/* INPUT */}

                    <input

                        placeholder={
                            isListening
                                ? "Listening..."
                                : "Ask AuraGPT..."
                        }

                        value={prompt}

                        onChange={(e) =>
                            setPrompt(
                                e.target.value
                            )
                        }

                        onKeyDown={(e) => {

                            if (
                                e.key === "Enter" &&
                                !e.shiftKey
                            ) {

                                e.preventDefault();

                                getReply();

                            }

                        }}

                    />


                    {/* SEND */}

                    <button
                        id="submit"
                        onClick={getReply}
                        disabled={
                            loading ||
                            !prompt.trim()
                        }
                    >

                        <i className="fa-solid fa-paper-plane"></i>

                    </button>


                    {/* SPEAK */}

                    {reply && (

                        <button
                            className="voiceButton"
                            onClick={
                                speakReply
                            }
                            title="Read response aloud"
                        >

                            <i className="fa-solid fa-volume-high"></i>

                        </button>

                    )}


                    {/* STOP */}

                    {reply && (

                        <button
                            className="voiceButton"
                            onClick={
                                stopSpeaking
                            }
                            title="Stop speaking"
                        >

                            <i className="fa-solid fa-stop"></i>

                        </button>

                    )}

                </div>


                <p className="info">

                    AuraGPT can make mistakes.
                    Check important info.
                    See Cookie Preferences.

                </p>

            </div>

        </div>

    );

}


export default ChatWindow;