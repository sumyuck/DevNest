import React, { useState } from "react";
import Editor from "@monaco-editor/react";

function App() {
  const defaultPrograms = {
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World! :C++\\n";
    return 0;
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, World! :C\\n");
    return 0;
}`,
    python: `print("Hello, World! :P")`
  };

  const [language, setLanguage] = useState("cpp");
  const [code, setCode] = useState(defaultPrograms["cpp"]);
  const [output, setOutput] = useState("");

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    setLanguage(selectedLanguage);
    setCode(defaultPrograms[selectedLanguage]);
  };

  const runCode = async () => {
    const response = await fetch("http://localhost:5000/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, language }),
    });
    const data = await response.json();
    setOutput(data.output);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Online IDE</h1>

      <label>Select Language: </label>
      <select value={language} onChange={handleLanguageChange}>
        <option value="cpp">C++</option>
        <option value="c">C</option>
        <option value="python">Python</option>
      </select>

      <div style={{ display: "flex", gap: "20px", marginTop: "10px" }}>
        <div style={{ width: "70%", minHeight: "500px", display: "flex", flexDirection: "column" }}>
          <Editor
            height="500px"
            width="100%"
            language={language}
            value={code}
            onChange={(value) => setCode(value)}
            options={{
              automaticLayout: true,
            }}
          />
          <button
            onClick={runCode}
            style={{ marginTop: "10px", padding: "10px 20px" }}
          >
            Run Code
          </button>
        </div>

        <div style={{ width: "30%", backgroundColor: "#f5f5f5", padding: "10px" }}>
          <h3>Output</h3>
          <pre>{output}</pre>
        </div>
      </div>
    </div>
  );
}

export default App;
