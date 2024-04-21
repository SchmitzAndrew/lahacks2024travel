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
        const binaryAudio = atob(base64Audio);
        const arrayBuffer = new ArrayBuffer(binaryAudio.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < binaryAudio.length; i++) {
            uint8Array[i] = binaryAudio.charCodeAt(i);
        }
        const blob = new Blob([uint8Array]);

        const objectURL = URL.createObjectURL(blob);
        const audio = new Audio();
        audio.src = objectURL;

        audio.play();
    }

    return (<>
        <button onClick={playTTS}>TTS Button</button>
    </>)
}
