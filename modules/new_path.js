const fs = require("fs");
const path = require("path");

// Допустимые форматы изображений
const validImageExtensions = [".png", ".jpg", ".jpeg"];

// Функция для перемещения файлов с использованием Promise
const moveFilesToFolder = (filePath, folderName, destDir) => {
  return new Promise((resolve, reject) => {
    const folderPath = path.join(destDir, folderName);

    // Логирование путей для отладки
    console.log(`Создание директории: ${folderPath}`);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const newFilePath = path.join(folderPath, path.basename(filePath));

    // Логирование для отладки
    console.log(`Перемещение файла: ${filePath} -> ${newFilePath}`);

    fs.rename(filePath, newFilePath, (err) => {
      if (err) {
        reject(`Ошибка при перемещении файла: ${err}`);
      } else {
        resolve();
      }
    });
  });
};

const new_path = async (destDir) => {
  // Логирование для проверки правильности пути
  console.log(`Чтение директории: ${destDir}`);

  // Проверяем, что директория существует
  if (!fs.existsSync(destDir)) {
    console.error(`Ошибка: директория ${destDir} не существует.`);
    return;
  }

  // Чтение файлов из директории
  const files = await fs.promises.readdir(destDir);

  // Обработка каждого файла в директории
  for (const file of files) {
    const ext = path.extname(file).toLowerCase(); // Получение расширения файла
    const baseName = path.basename(file, ext); // Получение базового имени без расширения

    // Проверка, является ли файл изображением
    if (validImageExtensions.includes(ext)) {
      // Используем только базовое имя без цифр
      const folderName = baseName.replace(/(\s*\d+.*)/, ""); // Убираем пробелы и номера

      // Логирование для отладки
      console.log(
        `Файл: ${file}, Расширение: ${ext}, Базовое имя: ${baseName}, Папка: ${folderName}`
      );

      // Ждем завершения перемещения файла
      await moveFilesToFolder(path.join(destDir, file), folderName, destDir);
    }
  }
};

module.exports = new_path;
