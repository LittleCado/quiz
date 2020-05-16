document.addEventListener("DOMContentLoaded", function () {
  // Constants
  const btnOpenModal = document.querySelector("#btnOpenModal");
  const modalBlock = document.querySelector("#modalBlock");
  const closeModal = document.querySelector("#closeModal");
  const questionTitle = document.querySelector("#question");
  const formAnswers = document.querySelector("#formAnswers");
  const prevBtn = document.querySelector("#prev");
  const nextBtn = document.querySelector("#next");

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
  btnOpenModal.addEventListener("click", () => {
    modalBlock.classList.remove("hide");
    // render question and answer
    renderQA();
  });

  closeModal.addEventListener("click", () => {
    modalBlock.classList.add("hide");
  });

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
    let questionNumber = 0;

    const renderAnswers = (qNumber) => {
      questions[qNumber].answers.forEach((answer, index) => {
        const answerItem = document.createElement("div");

        answerItem.classList.add(
          "answers-item",
          "d-flex",
          "justify-content-center"
        );

        answerItem.innerHTML = `
        <input type="${questions[qNumber].type}" id="answerItem${index}" name="answer" class="d-none">
          <label for="answerItem${index}" class="d-flex flex-column justify-content-between">
            <img class="answerImg" src="${answer.url}" alt="burger">
            <span>${answer.title}</span>
          </label>
        `;

        formAnswers.appendChild(answerItem);
      });
    };

    const renderQuestion = (qNumber) => {
      // when modal opens need to clean question and answers inside
      formAnswers.innerHTML = "";

      // Question on card
      questionTitle.textContent = questions[qNumber].question;
      renderAnswers(qNumber);
    };

    renderQuestion(questionNumber);

    // event listeners without addEventListener because on each open of modal creates one more listener
    prevBtn.onclick = () => {
      questionNumber--;
      renderQuestion(questionNumber);
    };

    nextBtn.onclick = () => {
      questionNumber++;
      renderQuestion(questionNumber);
    };
  };
});
