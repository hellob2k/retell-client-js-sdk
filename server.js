const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { RetellWebClient } = require("./controller"); // Adjust SDK path if needed

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/start-call", async (req, res) => {
    const { accessToken, sampleRate, captureDeviceId, playbackDeviceId } = req.body;

    if (!accessToken) {
        return res.status(400).json({ error: "Access token is required" });
    }

    try {
        const sdkClient = new RetellWebClient();
        await sdkClient.startCall({
            accessToken,
            sampleRate: sampleRate || 24000,
            captureDeviceId: captureDeviceId || "default",
            playbackDeviceId: playbackDeviceId || "default",
            emitRawAudioSamples: false,
        });
        res.status(200).json({ message: "Call started successfully" });
    } catch (error) {
        console.error("Error starting call:", error);
        res.status(500).json({ error: "Failed to start call", details: error.message });
    }
});

app.post("/stop-call", (req, res) => {
    try {
        const sdkClient = new RetellWebClient();
        sdkClient.stopCall();
        res.status(200).json({ message: "Call stopped successfully" });
    } catch (error) {
        console.error("Error stopping call:", error);
        res.status(500).json({ error: "Failed to stop call", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
