/** Dispatch a composed DOM event the Home Assistant frontend listens for. */
export function fireEvent(
  node: EventTarget,
  type: string,
  detail?: unknown,
): void {
  node.dispatchEvent(
    new CustomEvent(type, {
      detail,
      bubbles: true,
      composed: true,
    }),
  );
}
