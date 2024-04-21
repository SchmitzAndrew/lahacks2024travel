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
        const blob = new Blob([new Uint8Array([...binaryAudio].map(char => char.charCodeAt(0)))]);

        const objectURL = URL.createObjectURL(blob);
        const audio = new Audio();
        audio.src = objectURL;

        audio.play();
    }

    return (<>
        <button onClick={playTTS}>TTS Button</button>
    </>)
}
