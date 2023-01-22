let questions = JSON.parse(localStorage.getItem('questions')) ?? [];
let bad_questions = JSON.parse(localStorage.getItem('bad_questions')) ?? [];

// Set bad question counter
document.getElementById('bad-question-counter').innerHTML = bad_questions.length;

/// Current question index
let q_idx = -1;

/// Indicates if the subquestion should be randomly shuffled
let shuffle = true;
document.getElementById('should-shuffle').addEventListener('change', (e) => {
    shuffle = (e.currentTarget as HTMLInputElement).checked;
})

/// When shuffle is true it contains indexes where i-th question is now placed 
let shuffle_vector = [];

/// Generates random permutation from 0 to n - 1.
const randomPermutation = (n) => {
    let numbers = Array.from(Array(n).keys());
    numbers.sort(() => Math.random() - 0.5);
    return numbers;
}

/// If shuffle checkbox is checked returns random permutation
/// else returns permutation that is identity.
const randomIfChecked = (n) => {
    if (shuffle) {
        return randomPermutation(n);
    } else {
        return Array.from((n).keys());
    }
}

const importQuestions = () => {
    const input_elem = <HTMLInputElement>document.getElementById("import")
    const file = input_elem.files[0];
    if (file && confirm("Warning! Already existing database will be overwritten!")) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = (evt) => {
            localStorage.setItem('questions', evt.target.result.toString());
            questions = JSON.parse(evt.target.result.toString());
        }
        reader.onerror = (evt) => {
            alert("Error when reading the file");
        }
    }
}

const addQuestion = () => {
    let questions_div = document.getElementById("form-questions");
    let code = `
        <div class="question">
            <input type="checkbox" class="q-is-true">
            <input type="text" class="q-text">
        </div>
`;
    questions_div.innerHTML += code;
};

const submitQuestion = () => {
    const input_elem = document.getElementById("question-name") as HTMLInputElement;
    const question_name = input_elem.value;
    const subquestions = []
    let subq_div = document.getElementById('form-questions');

    subq_div.querySelectorAll('.question').forEach((q, key, parent) => {
        const question_elem = q.getElementsByClassName('q-text')[0] as HTMLInputElement;
        const text = question_elem.value;
        // Skip subquestion if text is empty
        if (!text) {
            return;
        }
        const checkbox = q.getElementsByClassName('q-is-true')[0] as HTMLInputElement;
        const is_true = checkbox.checked;
        subquestions.push({text: text, is_true: is_true});
    })

    subq_div.innerHTML = '';

    if (subquestions.length > 0) {
        questions.push({text: question_name, subquestions: subquestions});
        
        localStorage.setItem('questions', JSON.stringify(questions));
    }

    for (let i = 0; i < 5; ++i) {
        addQuestion();
    }
}

const hideForm = () => {
    const form = document.getElementById('add-form');
    form.style.display = 'none';
    document.getElementById('show-form-button').style.display = 'block';
}

const showForm = () => {
    const form = document.getElementById('add-form');
    form.style.display = 'block';
    document.getElementById('show-form-button').style.display = 'none';
}

const nextQuestion = () => {
    if (!questions.length) {
        return;
    }
    q_idx = (q_idx + 1) % questions.length;
    displayQuestion(questions[q_idx]);
}

const nextBadQuestion = () => {
    if (bad_questions.length == 0) {
        alert("No more questions!");
    } else {
        q_idx = bad_questions.shift();
        displayQuestion(questions[q_idx]);
    }
}

const displayQuestion = (question) => {
    updateQuestionsText();
    
    const question_text = document.getElementById('question-text');
    const subquestions_div = document.querySelector('#poss');
    let subquestions = question.subquestions;

    shuffle_vector = randomIfChecked(subquestions.length);

    subquestions_div.innerHTML = '';
    for (let i = 0; i < subquestions.length; ++i) {
        subquestions_div.innerHTML += `
            <div class="test-answer"><input class="is-true" type="checkbox"><span>${subquestions[shuffle_vector[i]].text}</span></div>
`;
    }

    question_text.innerText = question.text;
}

// TODO: This guy also updates the question index, so rename is probably in order
const updateQuestionsText = () => {
    localStorage.setItem('bad_questions', JSON.stringify(bad_questions));
    document.getElementById('bad-question-counter').innerHTML = bad_questions.length;
    document.getElementById('counter').innerHTML = `${q_idx + 1}/${questions.length}`
}

const evalQuestion = () => {
    const ref_answers = questions[q_idx].subquestions.map(s => s.is_true);
    const answers = document.getElementsByClassName("is-true");
    var right_answer = true;
    for (let i = 0; i < answers.length; ++i) {
        let idx = shuffle_vector[i];
        const answer_checkbox = answers[i] as HTMLInputElement;
        // Possibly refactor into some uber cool logic without if
        // Index the html checkboxes by i, not the permutated idx.
        // Because they were already permutated when rendered.
        const correct = answer_checkbox.checked == ref_answers[idx];
        if (!correct) {
            right_answer = false;
        }
        (answers[i].parentNode as HTMLElement).style.color = correct ? 'green' : 'red';
    }

    if (!right_answer && !bad_questions.includes(q_idx)) {
        bad_questions.push(q_idx);
        updateQuestionsText();
    }
}

for (let i = 0; i < 5; ++i) {
    addQuestion();
}

(document.getElementById('export') as HTMLLinkElement).href = URL.createObjectURL(new Blob([JSON.stringify(questions)]));

hideForm();