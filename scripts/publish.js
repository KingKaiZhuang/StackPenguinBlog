import { execSync } from "child_process";

function run() {
    console.log("🚀 開始推送更新到 GitHub...");
    try {
        execSync("git add .", { stdio: "inherit" });
        
        const status = execSync("git status --porcelain").toString();
        if (status.trim().length > 0) {
            const msg = process.argv[2] || "Update content";
            execSync(`git commit -m "${msg}"`, { stdio: "inherit" });
            execSync("git push", { stdio: "inherit" });
            console.log("✅ GitHub 推送成功！");
        } else {
            console.log("⚠️ 沒有需要推送的變更。");
        }
    } catch (e) {
        console.error("❌ Git 推送失敗", e.message);
        process.exit(1);
    }

    console.log("✅ 發布流程完成。Vercel 會在 GitHub 收到推送後自動部署。");
}

run();
