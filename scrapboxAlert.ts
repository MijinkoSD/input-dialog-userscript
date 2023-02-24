/// <reference no-default-lib="true" />
/// <reference lib="es2022" />
/// <reference lib="dom" />

import { createNewPromise, OutsidePromise, toCSSText } from "./deps.ts";
import { alertStyle } from "./style.ts";
import { AnswerButton, buildInButtons, Button } from "./button.ts";
import {
  addEventListenerToDocument,
  removeAllEventListenerFromDocument,
} from "./eventListener.ts";

export { buildInButtons };
export type { AnswerButton, Button };

const shadowDomId = "scrapbox-alert";

/**
 * アラートの挙動を指定するための型
 */
export interface AlertMode {
  buttons: Button[];
  /**
   * 決定時に優先して選択されるボタンの番号（既定は0）
   *
   * ここで設定した値は以下の場面で使用される
   * - 入力フォームでCtrl+Enterを入力したときに選択されるボタンの番号
   */
  priorityEnterButtonIndex?: number;
  /**
   * キャンセル時に優先して選択されるボタンの番号（省略した場合はキャンセル操作ができない）
   *
   * 領域外をクリックした時やEscキーを入力した時などに使用される
   */
  priorityCancelButtonIndex?: number;
}

/**
 * 組み込みのAlertMode
 */
export const buildInAlertModes: { [K in string]: AlertMode } = {
  OK: {
    buttons: [buildInButtons.OK],
    priorityCancelButtonIndex: 0,
  },
  OK_CANCEL: {
    buttons: [buildInButtons.OK, buildInButtons.CANCEL],
    priorityCancelButtonIndex: 1,
  },
  YES_NO: {
    buttons: [buildInButtons.YES, buildInButtons.NO],
  },
  YES_NO_CANCEL: {
    buttons: [buildInButtons.YES, buildInButtons.NO, buildInButtons.CANCEL],
    priorityCancelButtonIndex: 2,
  },
  ENTER: {
    buttons: [buildInButtons.ENTER],
    priorityEnterButtonIndex: 0,
  },
};

/**
 * アラート内でユーザーが行ったことを格納する型
 */
export interface AlertAnswer {
  button: AnswerButton;
  inputValue?: string;
}

/**
 * アラートを表示するよ！
 */
export async function scrapboxAlert(
  mode: AlertMode = buildInAlertModes.OK,
  title?: string,
  description?: string,
  defaultInputValue?: string,
): Promise<AlertAnswer> {
  const { background, inputArea, buttonArea } = renderAlertBase(
    title,
    description,
  );
  const input = document.createElement("textarea");
  const promise = createNewPromise<AlertAnswer>();
  if (isNeedInputForm(mode.buttons)) {
    if (defaultInputValue) input.textContent = defaultInputValue;
    inputArea.append(input);
  }
  const buttons = createButtonElements(mode.buttons, promise, input);
  buttonArea.append(
    ...buttons,
  );
  const priorityEnterButtonIndex = mode.priorityEnterButtonIndex
    ? mode.priorityEnterButtonIndex
    : 0;
  const enterButton = buttons[priorityEnterButtonIndex];
  const cancelButton = mode.priorityCancelButtonIndex
    ? buttons[mode.priorityCancelButtonIndex]
    : undefined;
  input.addEventListener("keydown", (e) => {
    if (
      e.key === "Enter" && e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey
    ) {
      enterButton.click();
    }
  });
  background.onclick = () => {
    if (cancelButton) cancelButton.click();
  };
  if (cancelButton) {
    addEventListenerToDocument({
      type: "keydown",
      listener: (e) => {
        if (
          e.key === "Escape" &&
          !e.ctrlKey && !e.shiftKey && !e.altKey && !e.metaKey
        ) {
          cancelButton.click();
        }
      },
    });
  }

  return promise.promise;
}

/**
 * アラートにおける共通部分のDOMを実装し、制御に使用するDOMの参照を返します
 */
function renderAlertBase(
  title?: string,
  description?: string,
): {
  background: HTMLDivElement;
  inputArea: HTMLDivElement;
  buttonArea: HTMLDivElement;
} {
  const shadowParent = document.createElement("div");
  shadowParent.id = shadowDomId;
  document.body.append(shadowParent);
  const shadow = shadowParent.attachShadow({ mode: "open" });

  const background = document.createElement("div");
  background.id = "background";

  const style = document.createElement("style");
  style.textContent = toCSSText(alertStyle);
  /** キャンセルできるようにするための背景 */
  const alertBG = document.createElement("div");
  alertBG.className = "alert-bg";

  const alertContainer = document.createElement("div");
  alertContainer.className = "container";
  const titleElm = document.createElement("p");
  titleElm.className = "title";
  titleElm.textContent = title ? title : "";
  const descriptionElm = document.createElement("div");
  descriptionElm.className = "description";
  if (description) {
    const descriptionLines = description.split("\n");
    for (const line of descriptionLines) {
      const lineElm = document.createElement("span");
      lineElm.textContent = line;
      const br = document.createElement("br");
      descriptionElm.append(lineElm, br);
    }
  }
  const inputArea = document.createElement("div");
  inputArea.className = "input-area";
  const buttonArea = document.createElement("div");
  buttonArea.className = "button-area";
  alertContainer.append(titleElm, descriptionElm, inputArea, buttonArea);
  background.append(alertBG, alertContainer, style);
  shadow.append(background);

  return {
    background: alertBG,
    inputArea: inputArea,
    buttonArea: buttonArea,
  };
}

/**
 * アラートのDOMを削除する
 */
function removeAlert() {
  const shadowParent = document.getElementById(shadowDomId);
  if (shadowParent === null) return;
  removeAllEventListenerFromDocument();
  shadowParent.remove();
}

/**
 * ボタンを作るよ！
 *
 * onClickの中身とかもここで設定する
 */
function createButtonElements(
  buttons: Button[],
  promise: OutsidePromise<AlertAnswer>,
  textarea?: HTMLTextAreaElement,
) {
  const buttonElms: HTMLButtonElement[] = [];
  for (const b of buttons) {
    const buttonElm = document.createElement("button");
    buttonElm.textContent = b.label;
    if (b.className) buttonElm.classList.add(b.className);
    buttonElm.onclick = () => {
      function runOnClick(): AlertAnswer {
        if (b.useInputForm) {
          console.log(`textContent: ${textarea?.value}`);
          if (textarea?.value) {
            return b.onClick({ InputValue: textarea?.value });
          } else {
            return b.onClick({ InputValue: "" });
          }
        } else return b.onClick(undefined);
      }
      promise.resolve(runOnClick());
      removeAlert();
    };
    buttonElms.push(buttonElm);
  }
  return buttonElms;
}

/**
 * InputFormを必要とするボタンが1つでも存在していたなら`true`を返す
 */
function isNeedInputForm(buttons: Button[]): boolean {
  for (const b of buttons) {
    if (b.useInputForm) return true;
  }
  return false;
}
