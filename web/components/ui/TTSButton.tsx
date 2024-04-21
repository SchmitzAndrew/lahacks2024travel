"use client"

interface TTSButtonProps {
    text: string
}
export default function TTSButton({text}: TTSButtonProps) {
    async function playTTS() {
        const serverUrl = process.env.NEXT_PUBLIC_FLASK_URL;
        const response = await fetch(`${serverUrl}/generatetts`, {
            method: "POST",
            body: JSON.stringify({
                "text": text
            }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        let parsedResponse = await response.json()

        const base64Audio = parsedResponse['content']
        //const base64Audio = "YOUR_BASE64_ENCODED_AUDIO_STRING_HERE";

// Decode the base64 string to binary data
const binaryAudio = atob(base64Audio);

// Convert the binary data to a Blob object
const blob = new Blob([new Uint8Array([...binaryAudio].map(char => char.charCodeAt(0)))]);

// Create an object URL from the Blob
const objectURL = URL.createObjectURL(blob);

// Create an <audio> element
const audio = new Audio();

// Set the src attribute to the object URL
audio.src = objectURL;

// Play the audio
audio.play();
    }

    return (<>
        <button onClick={playTTS}>TTS Button</button>
    </>)
}
