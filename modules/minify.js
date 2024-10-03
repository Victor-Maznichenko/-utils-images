const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

// Функция для сжатия изображений с использованием промисов
const minifyImage = (sourcePath, destPath) => {
  return sharp(sourcePath)
    .webp({
      quality: 75, // Снижение качества для уменьшения размера
      effort: 6, // Уровень сжатия (от 0 до 6)
      reductionEffort: 10, // Дополнительное сжатие (по умолчанию 4)
    })
    .toFile(destPath)
    .then(() => console.log(`Сжато и сохранено: ${destPath}`))
    .catch((err) => console.error(`Ошибка сжатия файла ${sourcePath}:`, err));
};

const minify = (sourceDir, destDir) => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdir(sourceDir, (err, files) => {
      if (err) {
        console.error("Ошибка чтения директории:", err);
        return reject(err);
      }

      // Список промисов для обработки каждого файла
      const minifyPromises = files.map((file) => {
        const ext = path.extname(file).toLowerCase();
        if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
          const sourcePath = path.join(sourceDir, file);
          const destPath = path.join(destDir, file.replace(ext, ".webp"));
          return minifyImage(sourcePath, destPath); // Возвращаем промис для каждого файла
        }
      });

      // Ждем завершения всех операций сжатия
      Promise.all(minifyPromises)
        .then(() => {
          console.log("Все файлы успешно сжаты.");
          resolve();
        })
        .catch((err) => {
          console.error("Ошибка при сжатии файлов:", err);
          reject(err);
        });
    });
  });
};

module.exports = minify;
