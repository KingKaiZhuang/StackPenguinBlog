import hljs from 'highlight.js';
import { visit } from 'unist-util-visit';

export function remarkGuessLang() {
    return (tree) => {
        visit(tree, 'code', (node) => {
            // Auto-detect language if it is missing or marked as plain text
            if (!node.lang || node.lang === 'text' || node.lang === 'txt') {
                if (node.value && node.value.trim().length > 0) {
                    const result = hljs.highlightAuto(node.value);
                    if (result.language) {
                        node.lang = result.language;
                    }
                }
            }
        });
    };
}
