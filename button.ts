/// <reference no-default-lib="true" />
/// <reference lib="es2022" />
/// <reference lib="dom" />

import { AlertAnswer } from "./scrapboxAlert.ts";

/**
 * 組み込みで実装してあるボタン
 */
export const buildInButtons: {
  [K in typeof buildInButtonNames[number]]: Button;
} = {
  OK: {
    label: "OK",
    useInputForm: false,
    onClick: () => {
      return { button: "OK" };
    },
    className: "button-OK",
  },
  CANCEL: {
    label: "キャンセル",
    useInputForm: false,
    onClick: () => {
      return { button: "CANCEL" };
    },
    className: "button-CANCEL",
  },
  YES: {
    label: "はい",
    useInputForm: false,
    onClick: () => {
      return { button: "YES" };
    },
    className: "button-YES",
  },
  NO: {
    label: "いいえ",
    useInputForm: false,
    onClick: () => {
      return { button: "NO" };
    },
    className: "button-NO",
  },
  ENTER: {
    label: "決定",
    useInputForm: true,
    onClick: (form) => {
      return {
        button: "ENTER",
        inputValue: form.InputValue,
      };
    },
    className: "button-ENTER",
  },
};

const buildInButtonNames = ["OK", "CANCEL", "YES", "NO", "ENTER"] as const;

/**
 * ボタンの型
 */
export type Button = {
  label: string;
  useInputForm: true;
  onClick: (form: { InputValue?: string }) => AlertAnswer;
  className?: string;
} | {
  label: string;
  useInputForm: false;
  onClick: (form: undefined) => AlertAnswer;
  className?: string;
};

/**
 * アラート内でユーザーが選択したボタンの型
 *
 * 現状名前を入れているだけ
 */
export type AnswerButton = typeof buildInButtonNames[number] | string;
