import globals from "globals";


export default [
  {languageOptions: { globals: globals.browser }},
  {
    rules: {
      "linebreak-style": ["error", "windows"]
    }
  },
];