const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");
const preview = document.getElementById("preview");
const generateButton = document.getElementById("generateButton");

let selectedFile = null;
let selectedStyle = "studio";


uploadButton.addEventListener("click", () => {
    fileInput.click();
});


fileInput.addEventListener("change", () => {

    const file = fileInput.files[0];

    if (!file) {
        return;
    }

    selectedFile = file;

    const imageUrl = URL.createObjectURL(file);

    preview.innerHTML = `
        <img src="${imageUrl}" alt="Товар">
    `;

    preview.style.display = "block";
});


document.querySelectorAll(".style").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".style")
            .forEach(item => item.classList.remove("active"));

        button.classList.add("active");

        selectedStyle = button.dataset.style;
    });

});


generateButton.addEventListener("click", () => {

    if (!selectedFile) {

        tg.showAlert("Сначала загрузи фотографию товара.");

        return;
    }

    tg.showAlert(
        `Фото загружено!\nСтиль: ${selectedStyle}\n\nAI-генерацию подключим следующим этапом.`
    );

});
