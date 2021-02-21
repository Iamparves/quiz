const filterBtn = document.querySelector('.filter__submit');

const loadQuiz = (api) => {
    const quizForm = document.querySelector('.quiz__form');
    const quizResultBox = document.querySelector('.quiz__result--box');

    quizForm.classList.remove('disable');
    quizResultBox.classList.remove('visible');
    quizForm.innerHTML = '<div class="spinner"></div>';

    fetch(api)
        .then(res => res.json())
        .then(data => {
            displayQuiz(data.results);
            matchQuiz(data.results);
        })
}

filterBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let api;
    const questionAmount = document.querySelector('.filter__number').value;
    const filterCategory = document.querySelector('.filter__category').value;
    const filterDifficulty = document.querySelector('.filter__difficulty').value;

    if (!questionAmount || questionAmount < 5) {
        displayWarning('Question amount must be a number and minimum 5');
        return
    } else if (filterCategory === 'any' && filterDifficulty === 'any') {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&type=multiple`
    } else if (filterCategory === 'any') {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&difficulty=${filterDifficulty}&type=multiple`
    } else if (filterDifficulty === 'any') {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&category=${filterCategory}&type=multiple`
    } else {
        api = `https://opentdb.com/api.php?amount=${questionAmount}&category=${filterCategory}&difficulty=${filterDifficulty}&type=multiple`
    }

    loadQuiz(api);
})

const displayQuiz = quizes => {
    const quizForm = document.querySelector('.quiz__form');
    quizForm.innerHTML = '';

    quizes.forEach((quiz, ind) => {
        ind++;
        const options = quiz.incorrect_answers;
        const random = Math.floor(Math.random() * 4);
        options.splice(random, 0, quiz.correct_answer)

        const question = `
                        <div class="question__box">
                            <p class="question__number">Question ${ind < 9 ? '0' + ind : ind}</p>
                            <h3 class="question">${quiz.question}</h3>
                            <div class="option__box">
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o1" value="${options[0]}">
                                    <label for="q${ind}o1"><span>${options[0]}</span></label>
                                </div>
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o2" value="${options[1]}">
                                    <label for="q${ind}o2"><span>${options[1]}</span></label>
                                </div>
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o3" value="${options[2]}">
                                    <label for="q${ind}o3"><span>${options[2]}</span></label>
                                </div>
                                <div class="option">
                                    <input type="radio" name="question${ind}" id="q${ind}o4" value="${options[3]}">
                                    <label for="q${ind}o4"><span>${options[3]}</span></label>
                                </div>
                            </div>
                        </div>
                        `
        quizForm.insertAdjacentHTML('beforeend', question)
    })

    const submitBtn = `<div class="submit__box">
                            <input class="submit btn__primary" type="submit" value="Submit Answer">
                        </div>`
    quizForm.insertAdjacentHTML('beforeend', submitBtn)
}

const matchQuiz = quizes => {
    const submitBtn = document.querySelector('.submit');
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (document.querySelectorAll('input[type="radio"]:checked').length < quizes.length) {
            displayWarning('Please select every questions answer and try to submit again');
            return
        }

        let marks = 0;
        quizes.forEach((quiz, ind) => {
            const selectedAnswer = document.querySelector(`input[name="question${ind + 1}"]:checked`);

            if (selectedAnswer.value === quiz.correct_answer) {
                marks += 1;
                selectedAnswer.classList.add('correct');
            } else {
                selectedAnswer.classList.add('wrong');

                for (let i = 1; i <= 4; i++) {
                    const option = document.getElementById(`q${ind + 1}o${i}`);
                    if (option.value === quiz.correct_answer) {
                        option.classList.add('correct');
                    }
                }
            }
        })

        const quizForm = document.querySelector('.quiz__form');
        const quizResultBox = document.querySelector('.quiz__result--box');
        const quizResult = document.querySelector('.quiz__result');

        quizResult.innerText = `${marks}/${quizes.length}`;
        quizForm.classList.add('disable');
        quizResultBox.classList.add('visible');

        window.location.hash = '';
        window.location.hash = 'quiz';

        submitBtn.style.display = 'none';
    })
}

const displayWarning = message => {
    const popup = document.querySelector('.popup');
    const popupDescription = document.querySelector('.popup__description');

    popupDescription.innerText = message;
    popup.classList.add('visible')

    setTimeout(function () {
        popup.classList.remove('visible');
    }, 2500)
}