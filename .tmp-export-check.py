from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:3001"
EMAIL = "medali@cadabry.app"
PASSWORD = "strong-password-2026!"
BROWSER = "/Users/medali/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell"

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True, executable_path=BROWSER)
    page = browser.new_page(viewport={"width": 1280, "height": 900})
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    page.on("pageerror", lambda error: errors.append(str(error)))

    page.goto(BASE + "/projects/new")
    page.wait_for_load_state("networkidle")
    if "/login" in page.url:
        page.get_by_label("Email").fill(EMAIL)
        page.get_by_label("Password").fill(PASSWORD)
        page.get_by_role("button", name="Sign in").click()
        page.wait_for_url(BASE + "/")
        page.goto(BASE + "/projects/new")
        page.wait_for_load_state("networkidle")

    export = page.get_by_role("button", name="Export all questions (.md)")
    with page.expect_download() as blank_info:
        export.click()
    blank = blank_info.value
    assert blank.suggested_filename == "new-project-questions.md"
    blank.save_as("/tmp/new-project-questions.md")
    with open("/tmp/new-project-questions.md", "r", encoding="utf-8") as file:
        blank_markdown = file.read()
    assert "## 1. The idea" in blank_markdown
    assert "## 7. Launch brief" in blank_markdown
    assert "Options: Mobile app" in blank_markdown

    page.get_by_label("Project name").fill("Signal Garden")
    page.get_by_label("What are you building?").fill("A visual research workspace for writers.")
    with page.expect_download() as filled_info:
        export.click()
    filled = filled_info.value
    assert filled.suggested_filename == "signal-garden-questions.md"
    filled.save_as("/tmp/signal-garden-questions.md")
    with open("/tmp/signal-garden-questions.md", "r", encoding="utf-8") as file:
        filled_markdown = file.read()
    assert "# Signal Garden questionnaire" in filled_markdown
    assert "A visual research workspace for writers." in filled_markdown

    page.screenshot(path="/tmp/cadabry-question-export.png", full_page=True)
    assert errors == [], errors
    print("questionnaire download checks passed")
    browser.close()
