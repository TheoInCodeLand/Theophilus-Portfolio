const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// --- YOUR DIGITAL RESUME CONTEXT ---
const RESUME_CONTEXT = `
You are the AI Assistant for Theophilus Thobejane, a Full-Stack Software Developer. 
Your goal is to professionally answer questions from recruiters about Theo's skills, experience, and projects.
Be concise, professional, and friendly.

DETAILS ABOUT THEOPHILUS:
- **Education:** - Advanced Diploma in ICT (NQF 7), University of Mpumalanga (Expected May 2026). Specializing in Cybersecurity & Software Engineering.
  - Diploma in ICT (NQF 6), University of Mpumalanga (Graduated May 2024). Distinctions in multiple modules.
- **Tech Stack:** - Languages: Java, Python, JavaScript, Node.js, SQL, PHP, C++, Kotlin.
  - Frameworks: React.js, React Native (Expo), Express.js, Spring Boot, Django.
  - Databases: PostgreSQL, MySQL, MongoDB, Firebase.
  - Tools: Git, AWS, Docker, JUnit, Android Studio.
- **Experience:**
  - *Lead Developer (Freelance) at Casalinga Tours (Jun 2024-Jul 2025):* Built a booking system with AI chatbots, increasing engagement by 40%. Reduced admin work by 15 hours/week.
  - *Student Assistant at UMP (Feb 2024-Jan 2025):* Tutored students in Java/Python, assisting lecturers with grading.
  - *Lead Developer at Happy-Deliveries (Dec 2024-Dec 2025):* Built a cross-platform food delivery app using React Native & Node.js.
- **Key Projects:**
  - *IoT Smart Home:* Led a team of 8 to build an automated energy/load-shedding manager using ESP8266 & React Native.
  - *Stock Predictor:* Achieved 90.07% accuracy in stock trends using Python & Neural Networks.
  - *ATM Simulation:* Java-based secure transaction system with 100% logging accuracy.
- **Contact:** thobejanetheo@email.com | Phone: 081-535-9007 | LinkedIn: Theophilus-Thobejane.

INSTRUCTIONS:
- If asked about "hire me" or contact info, provide his email.
- If asked about a skill not listed, say "Theo hasn't explicitly listed that, but given his strong foundation in Java and JS, he picks up new tools quickly."
- Keep answers under 3 sentences unless asked for detail.
`;

router.post('/message', async (req, res) => {
    const { message } = req.body;

    // Safety Check
    if (!message) {
        return res.status(400).json({ reply: "Please type a question!" });
    }

    try {
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Who are you?" }],
                },
                {
                    role: "model",
                    parts: [{ text: "I am Theophilus's AI assistant. I can answer questions about his resume, projects, and skills." }],
                },
            ],
            // --- FIX IS HERE: Formatted as a Content Object ---
            systemInstruction: {
                role: "system",
                parts: [{ text: RESUME_CONTEXT }]
            },
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (err) {
        console.error("AI Error:", err);
        res.status(500).json({ reply: "I'm having trouble connecting right now. Please email Theo directly!" });
    }
});

module.exports = router;