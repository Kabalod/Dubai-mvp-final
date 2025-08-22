import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]},
  {languageOptions: { globals: globals.browser }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    rules: {
      "react/react-in-jsx-scope": "off",
      "no-restricted-imports": ["error", {
        paths: [
          { name: "antd", importNames: ["Button"], message: "Use CustomButton from '@/components/CustomButton/CustomButton'" },
          { name: "antd", importNames: ["Tabs"], message: "Use CustomTabs from '@/components/CustomTabs/CustomTabs'" },
          { name: "antd", importNames: ["Input"], message: "Use CustomInput from '@/components/CustomInput/CustomInput'" },
          { name: "antd", importNames: ["Select"], message: "Use CustomSelect from '@/components/CustomSelect/CustomSelect'" }
        ]
      }]
    },
    settings: {
      react: {
        version: "detect"
      },
    },
  },
];