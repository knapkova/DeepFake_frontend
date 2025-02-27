/**
 * @param {HTMLElement} node
 * @param {string} data
 */
export function draggable(node, data) {
    let state = data;
    node.draggable = true;
    node.style.cursor = 'grab';

    function handle_dragstart(e) {
        console.log('Drag started:', state);
        e.dataTransfer.setData('text/plain', state);
    }
    node.addEventListener('dragstart', handle_dragstart);

    return {
        update(data) {
            state = data;
        },
        destroy() {
            node.removeEventListener('dragstart', handle_dragstart);
        }
    };
}

/**
 * @param {HTMLElement} node
 * @param {Object} options
 */
export function dropzone(node, options) {
    let optionsState = {
        dropEffect: 'move',
        dragover_class: 'droppable',
        ...options
    };

    function handle_dragenter(e) {
        e.preventDefault();
        e.target.classList.add(optionsState.dragover_class);
        console.log('Drag entered:', e.target);
    }

    function handle_dragover(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = optionsState.dropEffect;
        console.log('Drag over:', e.target);
    }

    function handle_dragleave(e) {
        e.target.classList.remove(optionsState.dragover_class);
        console.log('Drag left:', e.target);
    }

    function handle_drop(e) {
        e.preventDefault();
        e.target.classList.remove(optionsState.dragover_class);
        const data = e.dataTransfer.getData('text/plain');
        console.log('Dropped:', data, 'on', e.target);
        if (optionsState.onDrop) {
            optionsState.onDrop(data, node);
        }
    }

    node.addEventListener('dragenter', handle_dragenter);
    node.addEventListener('dragover', handle_dragover);
    node.addEventListener('dragleave', handle_dragleave);
    node.addEventListener('drop', handle_drop);

    return {
        destroy() {
            node.removeEventListener('dragenter', handle_dragenter);
            node.removeEventListener('dragover', handle_dragover);
            node.removeEventListener('dragleave', handle_dragleave);
            node.removeEventListener('drop', handle_drop);
        }
    };
}