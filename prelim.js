// Climate Guardians: Future Edition - Fixed JavaScript
class ClimateQuiz {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.totalQuestions = 0;
        this.isAnswering = false;

        this.currentTheme = localStorage.getItem('climate-quiz-theme') || 'light';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyTheme();
        this.loadSampleQuestions();
        this.displayQuestion();
        this.updateProgress();
    }

    setupEventListeners() {
        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        themeToggle.addEventListener('click', () => this.toggleTheme());

        // Restart button
        const restartBtn = document.getElementById('restart-btn');
        restartBtn.addEventListener('click', () => this.restartQuiz());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('climate-quiz-theme', this.currentTheme);

        // Animate theme toggle
        const toggle = document.getElementById('theme-toggle');
        toggle.style.transform = 'scale(1.2) rotate(360deg)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 300);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        document.getElementById('theme-toggle').textContent =
            this.currentTheme === 'light' ? '🌙' : '🌞';
    }

    loadSampleQuestions() {
        this.questions = [
            {
                question: "What percentage of global greenhouse gas emissions come from transportation?",
                options: ["About 14%", "About 24%", "About 34%", "About 44%"],
                correct: 0
            },
            {
                question: "Which renewable energy source has grown the fastest globally in recent years?",
                options: ["Solar power", "Wind power", "Hydroelectric power", "Geothermal power"],
                correct: 0
            },
            {
                question: "What is the main cause of ocean acidification?",
                options: ["Plastic pollution", "Oil spills", "CO2 absorption", "Industrial waste"],
                correct: 2
            },
            {
                question: "How much has global average temperature risen since pre-industrial times?",
                options: ["0.5°C", "1.1°C", "2.0°C", "3.2°C"],
                correct: 1
            },
            {
                question: "Which sector produces the most greenhouse gas emissions globally?",
                options: ["Transportation", "Agriculture", "Energy production", "Buildings"],
                correct: 2
            },
            {
                question: "What percentage of plastic waste is actually recycled globally?",
                options: ["Less than 10%", "About 25%", "About 50%", "About 75%"],
                correct: 0
            },
            {
                question: "Which gas has the highest global warming potential per molecule?",
                options: ["Carbon dioxide", "Methane", "Nitrous oxide", "Sulfur hexafluoride"],
                correct: 3
            },
            {
                question: "How many species are estimated to go extinct daily due to climate change?",
                options: ["10-50 species", "100-150 species", "150-300 species", "Over 1000 species"],
                correct: 1
            },
            {
                question: "What is the most effective individual action to reduce carbon footprint?",
                options: ["Eating less meat", "Flying less", "Having fewer children", "Using renewable energy"],
                correct: 2
            },
            {
                question: "By what year do scientists say we need to reach net-zero emissions?",
                options: ["2030", "2040", "2050", "2060"],
                correct: 2
            }
        ];

        this.totalQuestions = this.questions.length;
        document.getElementById('q-total').textContent = this.totalQuestions;
    }

    displayQuestion() {
        if (this.currentQuestion >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestion];
        document.getElementById('question-text').textContent = question.question;

        const optionsContainer = document.getElementById('options-container');
        optionsContainer.innerHTML = '';

        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.addEventListener('click', () => this.selectAnswer(index));
            optionsContainer.appendChild(button);
        });

        document.getElementById('q-current').textContent = this.currentQuestion + 1;
    }

    selectAnswer(selectedIndex) {
        if (this.isAnswering) return;
        this.isAnswering = true;

        const question = this.questions[this.currentQuestion];
        const options = document.querySelectorAll('.option-btn');
        const isCorrect = selectedIndex === question.correct;

        options.forEach(option => option.disabled = true);

        options[question.correct].classList.add('correct');
        if (!isCorrect) {
            options[selectedIndex].classList.add('incorrect');
        } else {
            this.score++;
            this.updateScore();
        }

        this.playSound(isCorrect ? 'correct' : 'incorrect');

        setTimeout(() => {
            this.currentQuestion++;
            this.isAnswering = false;
            this.updateProgress();
            this.displayQuestion();
        }, 1000);
    }

    updateScore() {
        document.getElementById('score-value').textContent = this.score;
    }

    updateProgress() {
        const progressPercent = (this.currentQuestion / this.totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = `${progressPercent}%`;
    }

    showResults() {
        document.getElementById('quiz-content').style.display = 'none';
        const results = document.getElementById('results-container');
        results.style.display = 'block';
        document.getElementById('final-score').textContent = `Your score: ${this.score}/${this.totalQuestions}`;
        document.getElementById('results-message').textContent =
            this.score === this.totalQuestions
                ? "Perfect! You're a true Climate Guardian 🌎"
                : "Great effort! Keep protecting the planet!";
    }

    restartQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.updateScore();
        document.getElementById('quiz-content').style.display = 'block';
        document.getElementById('results-container').style.display = 'none';
        this.displayQuestion();
        this.updateProgress();
    }

    playSound(type) {
        const audio = document.getElementById(type === 'correct' ? 'sound-correct' : 'sound-incorrect');
        audio.currentTime = 0;
        audio.play();
    }

    handleKeyPress(e) {
        if (e.key >= '1' && e.key <= '4') {
            const index = parseInt(e.key) - 1;
            const options = document.querySelectorAll('.option-btn');
            if (options[index]) {
                options[index].click();
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => new ClimateQuiz());
