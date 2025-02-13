/**
 * @param {HTMLElement} node
 * @param {any} data
 */
export function draggable(node, data) {
    let state = data;
    node.draggable = true;
    node.style.cursor = 'grab';

    function handle_dragstart(e) {
        e.dataTransfer.setData('text/plain', JSON.stringify(state));
    }
    node.addEventListener('dragstart', handle_dragstart);

    return {
        // update the data
        update(data) {
            state = data;
        },
        // destroy the event listener
        destroy() {
            node.removeEventListener('dragstart', handle_dragstart);
        }
    };
}

export function dropzone(node, options) {
    let state = {
        dropEffect: 'move', // telling browser to choose cursor
        dragover_class: 'droppable', // how to act when something is being dropped
        ...options
    };

    function handle_dragenter(e) {
        e.preventDefault();
        e.target.classList.add(state.dragover_class);
    }

    function handle_dragover(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = state.dropEffect;
    }

    function handle_dragleave(e) {
        e.target.classList.remove(state.dragover_class);
    }

    function handle_drop(e) {
        e.preventDefault();
        e.target.classList.remove(state.dragover_class);
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        if (state.onDrop) {
            state.onDrop(data, node);
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