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


// Загрузка фотографии
uploadButton.addEventListener("click", () => {
    fileInput.click();
});


// Выбрали фотографию
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


// Выбор стиля
document.querySelectorAll(".style").forEach(button => {

    button.addEventListener("click", () => {

        document.querySelectorAll(".style")
            .forEach(item => {
                item.classList.remove("active");
            });

        button.classList.add("active");

        selectedStyle = button.dataset.style;
    });

});


// Генерация
generateButton.addEventListener("click", async () => {

    if (!selectedFile) {

        tg.showAlert(
            "Сначала загрузи фотографию товара."
        );

        return;
    }

    generateButton.disabled = true;
    generateButton.innerText = "✨ Создаём фото...";

    try {

    console.log("Отправляем запрос на:", `${API_URL}/generate`);

    const formData = new FormData();

    formData.append("image", selectedFile);
    formData.append("style", selectedStyle);

    console.log("Файл:", selectedFile.name);
    console.log("Тип:", selectedFile.type);
    console.log("Размер:", selectedFile.size);

    const response = await fetch(
        `${API_URL}/generate`,
        {
            method: "POST",
            body: formData
        }
    );

    console.log("Ответ сервера:", response.status);

    const data = await response.json();

    console.log("Данные:", data);

    if (!response.ok) {
        throw new Error(
            data.detail || "Ошибка генерации"
        );
    }

    if (!data.image_base64) {
        throw new Error(
            "AI не вернул изображение"
        );
    }

    preview.innerHTML = `
        <img
            src="data:image/png;base64,${data.image_base64}"
            alt="Готовое фото"
        >
    `;

    preview.style.display = "block";

    generateButton.innerText = "✨ Создать ещё";

    tg.HapticFeedback.notificationOccurred("success");

} catch (error) {

    console.error("ОШИБКА:", error);

    tg.showAlert(
        "Ошибка:\n" + error.message
    );

    generateButton.innerText = "✨ Создать фото";

}

        console.error(error);

        tg.showAlert(
            "Не удалось создать фото:\n" +
            error.message
        );

        generateButton.innerText =
            "✨ Создать фото";

    } finally {

        generateButton.disabled = false;

    }

});
