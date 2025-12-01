export function useAppFunctions() {
  function onMaximize() {
    window.api.handleMaximise();
  }
  function onRestore() {
    window.api.handleRestore();
  }
  function onMinimize() {
    window.api.handleMinimize();
  }
  function onClose() {
    window.api.handleClose();
  }
  return {
    onMaximize,
    onRestore,
    onMinimize,
    onClose,
  };
}
