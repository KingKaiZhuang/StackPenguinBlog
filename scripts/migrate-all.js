import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const SOURCE_DIR = "/Users/stackpenguin/Documents/KingKaiZhuang.github.io/source/_posts";
const SKIP_FILES = [
    "本地專案推送至Bitbucket遠端存放庫.md",
    "在-Mac-vscode-中使用-Code-Runner-和-C-C-插件來編譯與執行-C-程式.md",
    "mac-docker-error.md" // already tested
];

function main() {
    const files = fs.readdirSync(SOURCE_DIR).filter(f => f.endsWith(".md"));
    let count = 0;
    
    for (const file of files) {
        if (SKIP_FILES.includes(file)) {
            console.log(`⏭️ 略過檔案: ${file}`);
            continue;
        }
        
        const filePath = path.join(SOURCE_DIR, file);
        console.log(`\n==============================================`);
        console.log(`🔄 處理第 ${count + 1} 個檔案: ${file}`);
        
        try {
            execSync(`node scripts/migrate-post.js "${filePath}"`, { stdio: "inherit" });
            console.log(`✅ ${file} 處理成功`);
        } catch (err) {
            console.error(`❌ ${file} 處理失敗`);
            console.error(err);
        }
        count++;
    }
    
    console.log(`\n🎉 全部處理完畢！共處理 ${count} 個檔案。`);
}

main();
