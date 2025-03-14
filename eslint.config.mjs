import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.jsx", "**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        __REACT_DEVTOOLS_GLOBAL_HOOK__: 'readonly',
        WorkerGlobalScope: 'readonly', 
        ...globals.browser,
        ...globals.node
      },
    },
    ignores: ["node_modules/", "dist/"],
    plugins: {
      react: pluginReact,
      "react-hooks": pluginReactHooks, // Asegúrate de incluir react-hooks aquí
    },
    rules: {
      "react/jsx-uses-react": "off", // Para React 17+
      "react/react-in-jsx-scope": "off", // Para React 17+
      "react/jsx-uses-vars": "error", // Asegura que las variables de JSX están en uso
      "react-hooks/rules-of-hooks": "error", // Enforce Hook rules
      "react-hooks/exhaustive-deps": "warn", // Advierte sobre dependencias en useEffect
    },
    settings: {
      react: {
        version: "detect", // Detecta automáticamente la versión de React
      },
    },
  },
  pluginJs.configs.recommended,
];
