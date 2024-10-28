// eslint.config.js
const eslintPluginReact = require("eslint-plugin-react");

module.exports = [
  {
    ignores: ["node_modules/**", "app/assets/builds/**", "public/**"],
  },
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    files: ["**/*.js", "**/*.jsx"], // Aplica às extensões de arquivos .js e .jsx
  },
  {
    plugins: {
      react: eslintPluginReact,
    },
    rules: {
      "react/react-in-jsx-scope": "off", // Para projetos com React 17 ou superior
      "react/prop-types": "off", // Desativa a validação de prop-types, se você não estiver usando
    },
  },
];
