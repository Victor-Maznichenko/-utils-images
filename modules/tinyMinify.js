const tinify = require("tinify");
const fs = require("fs").promises;
const path = require("path");

const API_KEYS = [
  "KK0n2dc2QYQ3J3glLQ92YgSskMLGg2Ms",
  "xqgPB9ldsgpNg0CPvDKBfnhyjbcGzN7q",
  "2FgVKHcp9kFntw41HwPPcfLT4NH0dbcT",
  "pKCBtt9M5V6PjVDX880QHPJJdTp7tS7k",
];

let apiKeyIndex = 0;
tinify.key = API_KEYS[apiKeyIndex];

// Функция для смены API ключа при превышении лимита
const switchApiKey = () => {
  apiKeyIndex = (apiKeyIndex + 1) % API_KEYS.length;
  tinify.key = API_KEYS[apiKeyIndex];
  console.log(`Сменили API ключ на: ${tinify.key}`);
};

// Функция для сжатия одного изображения
const compressImage = async (filePath) => {
  try {
    await tinify.fromFile(filePath).toFile(filePath);
    console.log(`Успешно сжато: ${path.basename(filePath)}`);
  } catch (err) {
    if (err instanceof tinify.AccountError) {
      console.error("Ошибка API ключа, пробуем следующий...");
      switchApiKey(); // Сменить ключ при ошибке лимита
      return compressImage(filePath); // Повторить попытку с новым ключом
    } else {
      console.error(`Ошибка сжатия ${path.basename(filePath)}:`, err);
    }
  }
};

// Функция для обработки директории
const tinyMinify = async (dirPath) => {
  try {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = await fs.stat(filePath);

      if (
        stats.isFile() &&
        path.extname(file) === ".webp" &&
        !filePath.includes(path.join(dirPath, "optimized"))
      ) {
        await compressImage(filePath);
      }
    }
  } catch (err) {
    console.error(`Ошибка обработки директории: ${err}`);
  }
};

// Экспорт функции для использования извне
module.exports = tinyMinify;
