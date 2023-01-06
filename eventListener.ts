/// <reference no-default-lib="true" />
/// <reference lib="es2022" />
/// <reference lib="dom" />

// deno-lint-ignore no-explicit-any
const eventLisnersInDocument: EventListerForDocument<any>[] = [];

export interface EventListerForDocument<K extends keyof DocumentEventMap> {
  type: K;
  // deno-lint-ignore no-explicit-any
  listener: (this: Document, ev: DocumentEventMap[K]) => any;
}

/** documentへイベントリスナーを登録する */
export function addEventListenerToDocument<K extends keyof DocumentEventMap>(
  arg: EventListerForDocument<K>,
) {
  const { type, listener } = arg;
  document.addEventListener(type, listener);
  eventLisnersInDocument.push({ type: type, listener: listener });
}

/** addEventListenerToDocumentで登録したイベントリスナーを全て削除する */
export function removeAllEventListenerFromDocument() {
  for (const el of eventLisnersInDocument) {
    document.removeEventListener(el.type, el.listener);
  }
}
