const express = require("express");
const cors = require("cors");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/execute", (req, res) => {
  const { code, language } = req.body;

  const dockerFolder = path.join(__dirname, "docker");

  if (!fs.existsSync(dockerFolder)) {
    fs.mkdirSync(dockerFolder, { recursive: true });
  }

  let fileName, dockerFileContent, buildCommand, runCommand;

  if (language === "cpp") {
    fileName = "code.cpp";
    dockerFileContent = `FROM gcc:latest
WORKDIR /app
COPY ${fileName} .
RUN g++ -o code ${fileName}
CMD ["./code"]`;
    buildCommand = `docker build -t cpp-code .`;
    runCommand = `docker run --rm cpp-code`;
  } else if (language === "c") {
    fileName = "code.c";
    dockerFileContent = `FROM gcc:latest
WORKDIR /app
COPY ${fileName} .
RUN gcc -o code ${fileName}
CMD ["./code"]`;
    buildCommand = `docker build -t c-code .`;
    runCommand = `docker run --rm c-code`;
  } else if (language === "python") {
    fileName = "code.py";
    dockerFileContent = `FROM python:3
WORKDIR /app
COPY ${fileName} .
CMD ["python", "${fileName}"]`;
    buildCommand = `docker build -t python-code .`;
    runCommand = `docker run --rm python-code`;
  } else {
    return res.status(400).json({ output: "Unsupported language." });
  }

  const codeFilePath = path.join(dockerFolder, fileName);
  fs.writeFileSync(codeFilePath, code);

  fs.writeFileSync(path.join(dockerFolder, "Dockerfile"), dockerFileContent);

  const command = `cd "${dockerFolder}" && ${buildCommand} && ${runCommand}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.json({ output: stderr || "An error occurred while executing the code." });
    }
    res.json({ output: stdout });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
