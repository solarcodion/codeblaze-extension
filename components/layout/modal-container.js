// Modal Container Component
window.ModalContainer = (() => {
  const createContainer = (content) => {
    const container = document.createElement('div');
    container.id = 'modal-container-root';
    container.className = 'fixed inset-0 flex items-center justify-center z-50 opacity-0 transition-opacity duration-300';
    container.innerHTML = `
      <div id="modal-container-backdrop" class="fixed inset-0 bg-black/80 backdrop-blur-sm"></div>
      <div id="modal-container-content" class="relative bg-zinc-900 rounded-lg shadow-xl w-[80vw] h-[80vh] flex flex-col overflow-hidden scale-95 opacity-0 transition-all duration-300">
        <div id="modal-container-inner" class="bg-zinc-900 flex flex-col h-full">
          ${content}
        </div>
      </div>
    `;

    // Add animation classes after a brief delay
    requestAnimationFrame(() => {
      container.classList.remove('opacity-0');
      const modalContent = container.querySelector('#modal-container-content');
      modalContent.classList.remove('scale-95', 'opacity-0');
      modalContent.classList.add('scale-100', 'opacity-100');

      // Log the computed background colors
      setTimeout(() => {
        const modalContent = container.querySelector('#modal-container-content');
        const modalInner = container.querySelector('#modal-container-inner');
        console.log('Modal container structure:', {
          content: {
            id: modalContent.id,
            bgColor: window.getComputedStyle(modalContent).backgroundColor,
            classes: modalContent.className
          },
          inner: {
            id: modalInner.id,
            bgColor: window.getComputedStyle(modalInner).backgroundColor,
            classes: modalInner.className
          }
        });
      }, 100);
    });

    return container;
  };

  return {
    createContainer
  };
})(); 