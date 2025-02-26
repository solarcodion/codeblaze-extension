// Main help modal component that ties everything together
window.HelpModal = {
  create() {
    const modal = window.HelpCreate.create();
    window.HelpHandlers.setupHelpModalHandlers(modal);
    window.HelpVoice.setupVoiceMode(modal);
    window.HelpStyles.addStyles();
    return modal;
  }
}; 