const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

// Функция для сжатия изображений с учетом полупрозрачности
const minifyImage = (sourcePath, destPath, hasAlpha) =>
  sharp(sourcePath)
    .webp({
      effort: 6,
      quality: 75,
      preset: "picture",
      smartSubsample: true,
      alphaQuality: hasAlpha ? 100 : 60,
    })
    .toFile(destPath)
    .then(() => console.log(`Сжато и сохранено: ${destPath}`))
    .catch((err) => console.error(`Ошибка сжатия файла ${sourcePath}:`, err));

const minify = (sourceDir, destDir) =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    fs.readdir(sourceDir, (err, files) => {
      if (err) {
        console.error("Ошибка чтения директории:", err);
        return reject(err);
      }

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        `Имеют ли изображения полупрозрачные элементы? (Дым, эффекты, вспышки) (y/n): `,
        (answer) => {
          rl.close();
          const hasAlpha = answer.toLowerCase() !== "n";
          const minifyPromises = files.map((file) => {
            const ext = path.extname(file).toLowerCase();
            if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
              const sourcePath = path.join(sourceDir, file);
              const destPath = path.join(destDir, file.replace(ext, ".webp"));
              return minifyImage(sourcePath, destPath, hasAlpha);
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
        }
      );
    });
  });

module.exports = minify;
