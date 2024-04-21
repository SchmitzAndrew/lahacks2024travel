# Hermes - Our LA Hacks 2024 Project
![image](https://github.com/SchmitzAndrew/lahacks2024travel/assets/8219702/665f9cb0-9947-4f8c-9e93-f98fe4cf501e)
## Demo Link
https://lahacks2024travel.vercel.app/
## What is Hermes?
Hermes is a webapp that lets people tour new places without being tethered to an expensive travel guide. Hermes creates a cohesive storyline as it helps you navigate the physical, historical, and cultural world of wherever you end up.

## How was Hermes built?
Hermes was built with a Next.js and TailwindCSS frontend, Python/ Flask backend, and a mix of APIs and SDKs including Elevenlabs' Speech Synthesis SDK, the Google Maps API, and Google Gemini.

## How can I run Hermes locally?
### Running the backend
1. Create a python virtual environment and cd into the backend folder
2. Run `pip install -r requirements.txt` to install the necessary pip packages
3. Rename .env.example to .env and paste in your relevant API keys
4. Run `python api.py` to run the Hermes web server

### Running the frontend
1. Install a recent version of Node.js (preferrably using nvm)
2. Cd into the web folder and run `npm i` to install the necessary npm packages
3. Rename .env.example to .env and paste in your relevant API keys
4. Run `npm run dev` to spin up the Next.js app
