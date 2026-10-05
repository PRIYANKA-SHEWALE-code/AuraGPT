import "dotenv/config";

const getGeminiAPIResponse = async (message) => {

    const options = {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },

        body: JSON.stringify({
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            text: message
                        }
                    ]
                }
            ]
        })
    };

    try {

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
            options
        );

        const data = await response.json();

        console.log("Gemini Status:", response.status);
        console.log("Gemini Data:", data);

        if (!response.ok) {
            throw new Error(JSON.stringify(data));
        }

        return data.candidates[0].content.parts[0].text;

    } catch (err) {

        console.log("Gemini Error:", err);

        throw err;
    }
};

export default getGeminiAPIResponse;