import hljs from 'highlight.js';
import { visit } from 'unist-util-visit';

// Map highlight.js languages to Shiki supported languages, or ignore them if unsupported
const langMap = {
    'arduino': 'cpp',
    'basic': 'vb',
    'dts': 'c',
    'routeros': 'bash',
    'pgsql': 'sql',
    'actionscript': 'ts',
    'vbnet': 'vb',
    'dos': 'bat',
    'angelscript': 'txt',
    'abnf': 'txt',
    'ebnf': 'txt',
    'nsis': 'txt',
    'autohotkey': 'txt',
    'mathematica': 'txt',
    'gams': 'txt',
    'fortran': 'txt',
    'livecodeserver': 'txt',
    'isbl': 'txt',
    'moonscript': 'txt',
    'gauss': 'txt',
    'arcade': 'txt',
    'crmsh': 'txt',
    'lasso': 'txt'
};

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
                        const mappedLang = langMap[result.language];
                        if (mappedLang === 'txt') {
                            node.lang = 'txt';
                        } else {
                            node.lang = mappedLang || result.language;
                        }
                    }
                }
            }
        });
    };
}
