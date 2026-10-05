import { createContext, useState } from "react";

export const MyContext = createContext(null);

export const MyProvider = ({ children }) => {

    const [prompt, setPrompt] = useState("");
    const [reply, setReply] = useState(null);

    const [currThreadId, setCurrThreadId] = useState(null);
    const [allThreads, setAllThreads] = useState([]);


    // =========================
    // DELETE THREAD
    // =========================
    const deleteThread = async (threadId) => {

        console.log("DELETE FUNCTION CALLED:", threadId);

        try {

            const response = await fetch(
                `http://localhost:8080/api/thread/${threadId}`,
                {
                    method: "DELETE"
                }
            );

            if (!response.ok) {
                throw new Error("Failed to delete thread");
            }

            // Remove deleted thread from sidebar
            setAllThreads((prevThreads) =>
                prevThreads.filter(
                    (thread) => thread.threadId !== threadId
                )
            );

            // If currently opened chat was deleted
            if (currThreadId === threadId) {
                setCurrThreadId(null);
                setReply(null);
            }

            console.log("Thread deleted successfully");

        } catch (err) {

            console.log("Delete error:", err);

        }
    };


    return (
        <MyContext.Provider
            value={{
                prompt,
                setPrompt,

                reply,
                setReply,

                currThreadId,
                setCurrThreadId,

                allThreads,
                setAllThreads,

                deleteThread
            }}
        >
            {children}
        </MyContext.Provider>
    );
};