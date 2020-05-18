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

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyBarOz1nZqBiCoF3ou2z-SkMCrJgG9fa54",
    authDomain: "testburger-cc84a.firebaseapp.com",
    databaseURL: "https://testburger-cc84a.firebaseio.com",
    projectId: "testburger-cc84a",
    storageBucket: "testburger-cc84a.appspot.com",
    messagingSenderId: "628167026769",
    appId: "1:628167026769:web:0924aa72f1ee500bb47070",
    measurementId: "G-9BZBPX5ZNF",
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  const getData = () => {
    formAnswers.textContent = "LOADING";
    nextBtn.classList.add("d-none");
    prevBtn.classList.add("d-none");

    firebase
      .database()
      .ref()
      .child("questions")
      .once("value")
      .then((snap) => renderQA(snap.val()));
  };

  // Event listeners
  // Button witch opens/close modal block
  btnOpenModal.addEventListener("click", () => {
    modalBlock.classList.remove("hide");
    // render question and answer
    getData();
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
  const renderQA = (questions) => {
    // Number of question
    let questionNumber = 0;
    const finalAnswers = [];
    const obj = {};

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

        //input only numbers
        const phoneNumber = document.getElementById("phoneNumber");
        phoneNumber.addEventListener("input", (event) => {
          event.target.value = event.target.value.replace(/[^0-9+()-]/, "");
        });
      }

      if (questionNumber === questions.length + 1) {
        questionTitle.innerHTML =
          "Спасибо, менеджер свяжется с вами через 5 мин";
        sendBtn.classList.add("d-none");

        // move info to finalAnswers
        for (let key in obj) {
          let newObj = {};
          newObj[key] = obj[key];
          finalAnswers.push(newObj);
        }

        // automatically close modal after 2 sec
        setTimeout(() => {
          modalBlock.classList.add("hide");
        }, 2000);
      }
    };

    renderQuestion(questionNumber);

    const checkAnswer = () => {
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

      // finalAnswers.push(obj);
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
      firebase.database().ref().child("contacts").push(finalAnswers);
      console.log(finalAnswers);
    };
  };
});
