const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Функция для запроса ввода с использованием промисов
const askQuestion = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

const rename = async (directoryPath) => {
  try {
    // Запрашиваем у пользователя подстроку для удаления
    const substring = await askQuestion(
      "Введите подстроку, которую нужно удалить из имен файлов: "
    );

    if (!substring) {
      console.log("Подстрока не может быть пустой.");
      return;
    }

    // Читаем содержимое директории
    const files = await fs.promises.readdir(directoryPath);

    // Фильтруем файлы, которые содержат подстроку
    const filesToRename = files.filter((file) => file.includes(substring));

    if (filesToRename.length === 0) {
      console.log(`Не найдено файлов, содержащих подстроку "${substring}".`);
      return;
    }

    // Переименовываем файлы
    for (const file of filesToRename) {
      const newFileName = file.replaceAll(substring, "");
      const oldFilePath = path.join(directoryPath, file);
      const newFilePath = path.join(directoryPath, newFileName);

      await fs.promises.rename(oldFilePath, newFilePath);
      console.log(`Файл переименован: ${file} -> ${newFileName}`);
    }
  } catch (err) {
    console.error("Произошла ошибка:", err);
  }
};

// Экспорт функции
module.exports = rename;
