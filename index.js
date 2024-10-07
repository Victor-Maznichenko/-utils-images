const rename = require("./modules/rename.js");
const minify = require("./modules/minify.js");
const tinyMinify = require("./modules/tinyMinify.js");
const new_path = require("./modules/new_path.js");

const SOURCE_PATH = "./images/source"; // Исходная директория с изображениями
const DEST_PATH = "./images/dest"; // Директория для сохранения изображений

// Выполнение скриптов последовательно
const runAllScripts = async () => {
  console.log("Запуск rename.js");
  await rename(SOURCE_PATH);

  console.log("Запуск minify.js");
  await minify(SOURCE_PATH, DEST_PATH);

  console.log("Запуск tinyJPG.js");
  await tinyMinify(DEST_PATH);

  // console.log("Запуск new_path.js");
  // await new_path(DEST_PATH);

  console.log("Все скрипты выполнены");
};

// Запуск выполнения
runAllScripts();
