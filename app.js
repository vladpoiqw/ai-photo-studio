const tg = window.Telegram.WebApp;

tg.ready();
tg.expand();

const API_URL = "https://api-photo-studio-ai.onrender.com";

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

    if (!file) return;

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

generateButton.addEventListener("click", async () => {

    if (!selectedFile) {
        tg.showAlert("Сначала загрузи фотографию.");
        return;
    }

    generateButton.disabled = true;
    generateButton.innerText = "Проверяем соединение...";

    try {

        const response = await fetch(`${API_URL}/health`, {
            method: "GET"
        });

        if (!response.ok) {
            throw new Error(
                `Сервер ответил: ${response.status}`
            );
        }

        const data = await response.json();

        tg.showAlert(
            "Связь с сервером работает!\n\n" +
            JSON.stringify(data)
        );

        generateButton.innerText = "Связь работает";

    } catch (error) {

        console.error(error);

        tg.showAlert(
            "Не удалось подключиться к серверу.\n\n" +
            error.message
        );

        generateButton.innerText = "Ошибка соединения";

    } finally {

        generateButton.disabled = false;

    }
});
