var _a, _b;
var questions = (_a = JSON.parse(localStorage.getItem('questions'))) !== null && _a !== void 0 ? _a : [];
var bad_questions = (_b = JSON.parse(localStorage.getItem('bad_questions'))) !== null && _b !== void 0 ? _b : [];
document.getElementById('bad-question-counter').innerHTML = bad_questions.length;
var q_idx = -1;
var shuffle = true;
document.getElementById('should-shuffle').addEventListener('change', function (e) {
    shuffle = e.currentTarget.checked;
});
var shuffle_vector = [];
var randomPermutation = function (n) {
    var numbers = Array.from(Array(n).keys());
    numbers.sort(function () { return Math.random() - 0.5; });
    return numbers;
};
var randomIfChecked = function (n) {
    if (shuffle) {
        return randomPermutation(n);
    }
    else {
        return Array.from((n).keys());
    }
};
var importQuestions = function () {
    var input_elem = document.getElementById("import");
    var file = input_elem.files[0];
    if (file && confirm("Warning! Already existing database will be overwritten!")) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            localStorage.setItem('questions', evt.target.result.toString());
            questions = JSON.parse(evt.target.result.toString());
        };
        reader.onerror = function (evt) {
            alert("Error when reading the file");
        };
    }
};
var addQuestion = function () {
    var questions_div = document.getElementById("form-questions");
    var code = "\n        <div class=\"question\">\n            <input type=\"checkbox\" class=\"q-is-true\">\n            <input type=\"text\" class=\"q-text\">\n        </div>\n";
    questions_div.innerHTML += code;
};
var submitQuestion = function () {
    var input_elem = document.getElementById("question-name");
    var question_name = input_elem.value;
    var subquestions = [];
    var subq_div = document.getElementById('form-questions');
    subq_div.querySelectorAll('.question').forEach(function (q, key, parent) {
        var question_elem = q.getElementsByClassName('q-text')[0];
        var text = question_elem.value;
        if (!text) {
            return;
        }
        var checkbox = q.getElementsByClassName('q-is-true')[0];
        var is_true = checkbox.checked;
        subquestions.push({ text: text, is_true: is_true });
    });
    subq_div.innerHTML = '';
    if (subquestions.length > 0) {
        questions.push({ text: question_name, subquestions: subquestions });
        localStorage.setItem('questions', JSON.stringify(questions));
    }
    for (var i = 0; i < 5; ++i) {
        addQuestion();
    }
};
var hideForm = function () {
    var form = document.getElementById('add-form');
    form.style.display = 'none';
    document.getElementById('show-form-button').style.display = 'block';
};
var showForm = function () {
    var form = document.getElementById('add-form');
    form.style.display = 'block';
    document.getElementById('show-form-button').style.display = 'none';
};
var nextQuestion = function () {
    if (!questions.length) {
        return;
    }
    q_idx = (q_idx + 1) % questions.length;
    displayQuestion(questions[q_idx]);
};
var nextBadQuestion = function () {
    if (bad_questions.length == 0) {
        alert("No more questions!");
    }
    else {
        q_idx = bad_questions.shift();
        displayQuestion(questions[q_idx]);
    }
};
var displayQuestion = function (question) {
    updateQuestionsText();
    var question_text = document.getElementById('question-text');
    var subquestions_div = document.querySelector('#poss');
    var subquestions = question.subquestions;
    shuffle_vector = randomIfChecked(subquestions.length);
    subquestions_div.innerHTML = '';
    for (var i = 0; i < subquestions.length; ++i) {
        subquestions_div.innerHTML += "\n            <div class=\"test-answer\"><input class=\"is-true\" type=\"checkbox\"><span>".concat(subquestions[shuffle_vector[i]].text, "</span></div>\n");
    }
    question_text.innerText = question.text;
};
var updateQuestionsText = function () {
    localStorage.setItem('bad_questions', JSON.stringify(bad_questions));
    document.getElementById('bad-question-counter').innerHTML = bad_questions.length;
    document.getElementById('counter').innerHTML = "".concat(q_idx + 1, "/").concat(questions.length);
};
var evalQuestion = function () {
    var ref_answers = questions[q_idx].subquestions.map(function (s) { return s.is_true; });
    var answers = document.getElementsByClassName("is-true");
    var right_answer = true;
    for (var i = 0; i < answers.length; ++i) {
        var idx = shuffle_vector[i];
        var answer_checkbox = answers[i];
        var correct = answer_checkbox.checked == ref_answers[idx];
        if (!correct) {
            right_answer = false;
        }
        answers[i].parentNode.style.color = correct ? 'green' : 'red';
    }
    if (!right_answer && !bad_questions.includes(q_idx)) {
        bad_questions.push(q_idx);
        updateQuestionsText();
    }
};
for (var i = 0; i < 5; ++i) {
    addQuestion();
}
document.getElementById('export').href = URL.createObjectURL(new Blob([JSON.stringify(questions)]));
hideForm();
