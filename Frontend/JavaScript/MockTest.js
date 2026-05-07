const hamburger = document.getElementById('hamburger');
const menu = document.getElementById('menu');
const navButtons = document.getElementById('navButtons');

hamburger.addEventListener('click', () => {
  menu.classList.toggle('active');
  navButtons.classList.toggle('active');
  hamburger.textContent = menu.classList.contains('active') ? '✕' : '☰';
});
// Mock Test Data

const testData = {
    reading: {
        passage: `The invention of the telephone by Alexander Graham Bell was a pivotal moment in human history. 
                 On March 10, 1876, Bell made the first successful telephone call, speaking the famous words: 
                 "Mr. Watson, come here, I want to see you." This revolutionary device would transform the way 
                 humans communicate, laying the groundwork for today's interconnected world.`,
        questions: [
            {
                question: "Who invented the telephone?",
                options: ["Thomas Edison", "Alexander Graham Bell", "Nikola Tesla", "Graham Watson"],
                correct: 1
            },
            {
                question: "What year was the first successful telephone call made?",
                options: ["1875", "1876", "1877", "1878"],
                correct: 1
            }
        ]
    },
    listening: {
        audioUrl: "/Assests/pictures/listeningaudio.mp3",
        questions: [
            {
                question: "Which one things should the caller bring to the meeting?",
                options: ["Passport", "Tax bill", "Employment contract", "Reference from a friend or colleague"],
                correct: 0
            },
            {
                question: "What time do the caller and apartment manager decide to meet?",
                options: ["5:30 PM", "6:00 PM", "6:30 PM"],
                correct: 1
            }
        ]
    },
    writing: {
        prompt: "Discuss the advantages and disadvantages of social media in modern society. Write at least 250 words."
    },
    speaking: {
        questions: [
            "Describe your favorite place to visit and explain why you like it.",
            "Talk about a memorable experience from your childhood.",
            "Discuss your future career goals and aspirations."
        ]
    }
};

let currentSection = 'reading';
let currentQuestionIndex = 0;
let answers = {
    reading: [],
    listening: [],
    writing: '',
    speaking: []
};
let timer;
let timeLeft = 3600; // 60 minutes
let mediaRecorder;
let audioChunks = [];

// Initialize the test
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('start-test').addEventListener('click', startTest);
    
    // Section navigation
    document.querySelectorAll('.section-btn').forEach(button => {
        button.addEventListener('click', () => switchSection(button.dataset.section));
    });
    
    // Navigation controls
    document.getElementById('prev-question').addEventListener('click', previousQuestion);
    document.getElementById('next-question').addEventListener('click', nextQuestion);
    document.getElementById('submit-test').addEventListener('click', submitTest);
    
    // Recording controls
    document.getElementById('start-recording').addEventListener('click', startRecording);
    document.getElementById('stop-recording').addEventListener('click', stopRecording);
    
    // Writing section word count
    const writingAnswer = document.getElementById('writing-answer');
    if (writingAnswer) {
        writingAnswer.addEventListener('input', updateWordCount);
    }
    
    // Initialize answer tracking for radio buttons
    document.addEventListener('change', (e) => {
        if (e.target.type === 'radio') {
            const questionIndex = parseInt(e.target.name.split('-q')[1]);
            const sectionType = e.target.name.split('-q')[0];
            answers[sectionType][questionIndex] = parseInt(e.target.value);
            updateQuestionNumbers();
            updateNavigationButtons();
        }
    });
});


function startTest() {
    document.getElementById('test-info').classList.add('hidden');
    document.getElementById('test-sections').classList.remove('hidden');
    startTimer();
    loadSection('reading');
    updateQuestionNumbers();
    updateNavigationButtons();
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            submitTest();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('main-timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function switchSection(section) {
    if (section === currentSection) return;
    
    // Auto-save writing section content
    if (currentSection === 'writing') {
        answers.writing = document.getElementById('writing-answer').value;
    }
    
    currentSection = section;
    currentQuestionIndex = 0;
    
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    document.querySelectorAll('.test-section').forEach(section => {
        section.classList.add('hidden');
    });
    document.getElementById(`${section}-section`).classList.remove('hidden');
    
    loadSection(section);
    updateQuestionNumbers();
    updateNavigationButtons();
}

function updateQuestionNumbers() {
    const numberGrid = document.querySelector('.number-grid');
    const maxQuestions = {
        reading: testData.reading.questions.length,
        listening: testData.listening.questions.length,
        writing: 1,
        speaking: testData.speaking.questions.length
    };
    
    numberGrid.innerHTML = '';
    
    for (let i = 0; i < maxQuestions[currentSection]; i++) {
        const numberDiv = document.createElement('div');
        numberDiv.className = 'question-number';
        if (i === currentQuestionIndex) numberDiv.classList.add('active');
        if (answers[currentSection][i] !== undefined) numberDiv.classList.add('answered');
        numberDiv.textContent = i + 1;
        numberDiv.addEventListener('click', () => {
            currentQuestionIndex = i;
            loadSection(currentSection);
            updateQuestionNumbers();
            updateNavigationButtons();
        });
        numberGrid.appendChild(numberDiv);
    }
}

function loadSection(section) {
    switch(section) {
        case 'reading':
            loadReadingSection();
            break;
        case 'listening':
            loadListeningSection();
            break;
        case 'writing':
            loadWritingSection();
            break;
        case 'speaking':
            loadSpeakingSection();
            break;
    }
}

function loadReadingSection() {
    const readingContent = document.getElementById('reading-content');
    const readingQuestions = document.getElementById('reading-questions');
    
    readingContent.innerHTML = `<p>${testData.reading.passage}</p>`;
    
    // Display the current question only
    const currentQuestion = testData.reading.questions[currentQuestionIndex];
    readingQuestions.innerHTML = `
        <div class="question">
            <p>${currentQuestionIndex + 1}. ${currentQuestion.question}</p>
            <div class="options">
                ${currentQuestion.options.map((option, i) => `
                    <label>
                        <input type="radio" name="reading-q${currentQuestionIndex}" value="${i}" 
                        ${answers.reading[currentQuestionIndex] === i ? 'checked' : ''}>
                        ${option}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}


function loadListeningSection() {
    const audio = document.getElementById('listening-audio');
    const questions = document.getElementById('listening-questions');
    
    // Make sure to load the audio dynamically if needed
    audio.src = testData.listening.audioUrl;
    audio.load(); // Ensure the audio source is loaded
    
    // Optionally play the audio automatically when section is loaded
    audio.play().catch((error) => {
        console.error('Error playing audio:', error);
    });
    
    // Display only the current question
    const currentQuestion = testData.listening.questions[currentQuestionIndex];
    questions.innerHTML = `
        <div class="question">
            <p>${currentQuestionIndex + 1}. ${currentQuestion.question}</p>
            <div class="options">
                ${currentQuestion.options.map((option, i) => `
                    <label>
                        <input type="radio" name="listening-q${currentQuestionIndex}" value="${i}"
                        ${answers.listening[currentQuestionIndex] === i ? 'checked' : ''}>
                        ${option}
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}



function loadWritingSection() {
    const writingPrompt = document.querySelector('.writing-prompt');
    writingPrompt.textContent = testData.writing.prompt;
    
    const textarea = document.getElementById('writing-answer');
    textarea.value = answers.writing;
    updateWordCount();
}

function updateWordCount() {
    const textarea = document.getElementById('writing-answer');
    const wordCount = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('word-count').textContent = `Words: ${wordCount}/250`;
    answers.writing = textarea.value;
}

function loadSpeakingSection() {
    const prompt = document.querySelector('.speaking-prompt');
    prompt.textContent = testData.speaking.questions[currentQuestionIndex];
    document.getElementById('recording-playback').classList.add('hidden');
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.addEventListener('dataavailable', event => {
            audioChunks.push(event.data);
        });
        
        mediaRecorder.addEventListener('stop', () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = document.getElementById('recording-playback');
            audio.src = audioUrl;
            audio.classList.remove('hidden');
            answers.speaking[currentQuestionIndex] = audioUrl;
            updateQuestionNumbers();
            updateNavigationButtons();
        });
        
        mediaRecorder.start();
        
        // Indicate recording is in progress
        document.getElementById('start-recording').disabled = true;
        document.getElementById('stop-recording').disabled = false;
        document.getElementById('recording-status').textContent = "Recording in progress...";
    } catch (err) {
        console.error('Error accessing microphone:', err);
        alert('Error accessing microphone. Please ensure you have given permission to use the microphone.');
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        document.getElementById('start-recording').disabled = false;
        document.getElementById('stop-recording').disabled = true;
        
        // Reset the recording status text
        document.getElementById('recording-status').textContent = "Recording stopped.";
    }
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadSection(currentSection);
        updateQuestionNumbers();
        updateNavigationButtons();
    }
}

function nextQuestion() {
    const maxQuestions = {
        reading: testData.reading.questions. length,
        listening: testData.listening.questions.length,
        writing: 1,
        speaking: testData.speaking.questions.length
    };
    
    if (currentQuestionIndex < maxQuestions[currentSection] - 1) {
        currentQuestionIndex++;
        loadSection(currentSection);
        updateQuestionNumbers();
        updateNavigationButtons();
    } else {
        // Move to next section if available
        const sections = ['reading', 'listening', 'writing', 'speaking'];
        const currentIndex = sections.indexOf(currentSection);
        if (currentIndex < sections.length - 1) {
            switchSection(sections[currentIndex + 1]);
        }
    }
}

function updateNavigationButtons() {
    const prevButton = document.getElementById('prev-question');
    const nextButton = document.getElementById('next-question');
    const submitButton = document.getElementById('submit-test');
    
    // Disable previous button if at first question
    prevButton.disabled = currentQuestionIndex === 0;

    const maxQuestions = {
        reading: testData.reading.questions.length,
        listening: testData.listening.questions.length,
        writing: 1,
        speaking: testData.speaking.questions.length
    };

    const isLastQuestion = currentQuestionIndex === maxQuestions[currentSection] - 1;
    const isLastSection = currentSection === 'speaking';

    // Enable or disable next button
    if (!isLastQuestion || !isLastSection) {
        nextButton.classList.remove('hidden');
        submitButton.classList.add('hidden');
    } else {
        // Show submit button only on last question of last section
        nextButton.classList.add('hidden');
        submitButton.classList.remove('hidden');
    }
}

function calculateScores() {
    const scores = {
        reading: 0,
        listening: 0,
        writing: 0,
        speaking: 0
    };
    
    // Calculate Reading score
    testData.reading.questions.forEach((q, i) => {
        if (answers.reading[i] === q.correct) scores.reading++;
    });
    
    // Calculate Listening score
    testData.listening.questions.forEach((q, i) => {
        if (answers.listening[i] === q.correct) scores.listening++;
    });
    
    // Simulate Writing and Speaking scores
    scores.writing = Math.floor(Math.random() * 3) + 7; // Random score between 7-9
    scores.speaking = Math.floor(Math.random() * 3) + 7; // Random score between 7-9
    
    return scores;
}

function submitTest() {
    clearInterval(timer); // Stop the timer

    // Save last section inputs
    if (currentSection === 'writing') {
        answers.writing = document.getElementById('writing-answer').value;
    }

    // --- Score calculation ---
    let readingScore = 0;
    testData.reading.questions.forEach((q, i) => {
        if (answers.reading[i] === q.correct) {
            readingScore++;
        }
    });

    let listeningScore = 0;
    testData.listening.questions.forEach((q, i) => {
        if (answers.listening[i] === q.correct) {
            listeningScore++;
        }
    });

    const writingTotal = 1; // Assuming 1 writing task
    const writingScore = answers.writing.trim() ? 1 : 0;

    const speakingTotal = testData.speaking.questions.length;
    let speakingScore = 0;
    answers.speaking.forEach((response) => {
        if (response) speakingScore++;
    });

    // --- Display Scores ---
    document.getElementById('reading-score').textContent = `${readingScore}/${testData.reading.questions.length}`;
    document.getElementById('listening-score').textContent = `${listeningScore}/${testData.listening.questions.length}`;
    document.getElementById('writing-score').textContent = `${writingScore}/${writingTotal}`;
    document.getElementById('speaking-score').textContent = `${speakingScore}/${speakingTotal}`;

    // --- Calculate total and percentage ---
    const totalObtained = readingScore + listeningScore + writingScore + speakingScore;
    const totalPossible = testData.reading.questions.length + testData.listening.questions.length + writingTotal + speakingTotal;
    const percentage = (totalObtained / totalPossible) * 100;

    // --- Feedback based on performance ---
    const feedback = document.querySelector('.feedback');
    let feedbackMessage = "";

    if (percentage >= 80) {
        feedbackMessage = `<p><strong>Excellent!</strong> You've done a great job. Keep up the fantastic work! 💯</p>`;
    } else if (percentage >= 50) {
        feedbackMessage = `<p><strong>Good effort!</strong> You’re on the right track. A bit more practice and you’ll get even better. 💪</p>`;
    } else {
        feedbackMessage = `<p><strong>Keep trying!</strong> Don't worry if you didn't score high. Practice regularly and you'll improve in no time! 🌱</p>`;
    }

    feedback.innerHTML = feedbackMessage;

    // --- Show Results Section ---
    document.getElementById('test-sections').classList.add('hidden');
    document.getElementById('results-section').classList.remove('hidden');
}
