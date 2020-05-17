document.addEventListener("DOMContentLoaded", function () {
  // Constants
  const btnOpenModal = document.querySelector("#btnOpenModal");
  const modalBlock = document.querySelector("#modalBlock");
  const closeModal = document.querySelector("#closeModal");
  const questionTitle = document.querySelector("#question");
  const formAnswers = document.querySelector("#formAnswers");
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");
  const sendBtn = document.querySelector("#send");

  // Block with questions
  const questions = [
    {
      question: "Какого цвета бургер?",
      answers: [
        {
          title: "Стандарт",
          url: "./image/burger.png",
        },
        {
          title: "Черный",
          url: "./image/burgerBlack.png",
        },
      ],
      type: "radio",
    },
    {
      question: "Из какого мяса котлета?",
      answers: [
        {
          title: "Курица",
          url: "./image/chickenMeat.png",
        },
        {
          title: "Говядина",
          url: "./image/beefMeat.png",
        },
        {
          title: "Свинина",
          url: "./image/porkMeat.png",
        },
      ],
      type: "radio",
    },
    {
      question: "Дополнительные ингредиенты?",
      answers: [
        {
          title: "Помидор",
          url: "./image/tomato.png",
        },
        {
          title: "Огурец",
          url: "./image/cucumber.png",
        },
        {
          title: "Салат",
          url: "./image/salad.png",
        },
        {
          title: "Лук",
          url: "./image/onion.png",
        },
      ],
      type: "checkbox",
    },
    {
      question: "Добавить соус?",
      answers: [
        {
          title: "Чесночный",
          url: "./image/sauce1.png",
        },
        {
          title: "Томатный",
          url: "./image/sauce2.png",
        },
        {
          title: "Горчичный",
          url: "./image/sauce3.png",
        },
      ],
      type: "radio",
    },
  ];

  // Event listeners

  // Button witch opens/close modal block
  btnOpenModal.addEventListener("click", () => {
    modalBlock.classList.remove("hide");
    // render question and answer
    renderQA();
  });

  closeModal.addEventListener("click", () => {
    modalBlock.classList.add("hide");
  });

  // when click not on modal close modal
  document.addEventListener("click", (event) => {
    if (
      !event.target.closest(".modal-dialog") &&
      !event.target.closest(".openModalButton")
    ) {
      modalBlock.classList.add("hide");
    }
  });

  // Funtions

  // renderQA renders question and answer by running renderQuestion function and renderAnswers
  // renderQuestion function render question title and runs renderAnswers function
  // renderAnswer function render as many answers as there are in array questions[i].answers
  const renderQA = () => {
    // Number of question
    let questionNumber = 0;
    const finalAnswers = [];

    const renderAnswers = (qNumber) => {
      questions[qNumber].answers.forEach((answer, index) => {
        const answerItem = document.createElement("div");

        answerItem.classList.add(
          "answers-item",
          "d-flex",
          "justify-content-center"
        );

        answerItem.innerHTML = `
        <input type="${questions[qNumber].type}" id="answerItem${index}" name="answer" class="d-none" value="${answer.title}">
          <label for="answerItem${index}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="${answer.url}" alt="burger">
            <span>${answer.title}</span>
          </label>
        `;

        formAnswers.appendChild(answerItem);
      });
    };

    const renderQuestion = (qNumber) => {
      // When modal opens need to clean answers inside
      formAnswers.innerHTML = "";

      // check if we try to render question that we havent in object with questionss
      if (questionNumber >= 0 && questionNumber <= questions.length - 1) {
        // Question on modal
        questionTitle.textContent = questions[qNumber].question;
        renderAnswers(qNumber);

        prevBtn.classList.remove("d-none");
        nextBtn.classList.remove("d-none");
        sendBtn.classList.add("d-none");
      }

      if (questionNumber === 0) {
        prevBtn.classList.add("d-none");
      }

      if (questionNumber === questions.length) {
        questionTitle.innerHTML = "";
        formAnswers.innerHTML = `
        <div class="form-group">
          <label for="phoneNumber">Введите ваш номер телефона</label>
          <input type="phone" class="form-control" id="phoneNumber" placeholder="Номер телефона">
        </div>
        `;

        nextBtn.classList.add("d-none");
        sendBtn.classList.remove("d-none");
      }

      if (questionNumber === questions.length + 1) {
        questionTitle.innerHTML =
          "Спасибо, менеджер свяжется с вами через 5 мин";
        // automatically close modal after 2 sec
        setTimeout(() => {
          modalBlock.classList.add("hide");
        }, 2000);
      }
    };

    renderQuestion(questionNumber);

    const checkAnswer = () => {
      const obj = {};
      const inputs = [...formAnswers.elements].filter(
        (input) => input.checked || input.id === "phoneNumber"
      );

      inputs.forEach((input, index) => {
        if (questionNumber >= 0 && questionNumber <= questions.length - 1) {
          obj[`${index}_${questions[questionNumber].question}`] = input.value;
        }

        if (questionNumber == questions.length) {
          obj["Номер телефона"] = input.value;
        }
      });

      finalAnswers.push(obj);
    };

    // event listeners without addEventListener because on each open of modal creates one more listener
    prevBtn.onclick = () => {
      questionNumber--;
      renderQuestion(questionNumber);
    };

    nextBtn.onclick = () => {
      checkAnswer();
      questionNumber++;
      renderQuestion(questionNumber);
    };

    sendBtn.onclick = () => {
      checkAnswer();
      questionNumber++;
      renderQuestion(questionNumber);
      console.log(finalAnswers);
    };
  };
});
