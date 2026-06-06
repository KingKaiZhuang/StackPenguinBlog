import hljs from 'highlight.js';
import { visit } from 'unist-util-visit';

export function remarkGuessLang() {
    return (tree) => {
        visit(tree, 'code', (node) => {
            // Auto-detect language if it is missing or marked as plain text
            if (!node.lang || node.lang === 'text' || node.lang === 'txt') {
                if (node.value && node.value.trim().length > 0) {
                    // 特殊處理：如果是終端機指令或常見的 prompt，直接指定為 shell
                    if (/^\s*(\$|#|>|.*?>.*?»)\s/m.test(node.value) || /BetterCap/i.test(node.value)) {
                        node.lang = 'shell';
                        return;
                    }

                    const result = hljs.highlightAuto(node.value);
                    if (result.language) {
                        node.lang = result.language;
                    }
                }
            }
        });
    };
}
