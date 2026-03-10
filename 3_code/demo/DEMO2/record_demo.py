import asyncio
import time
import os
import shutil
import sys
from playwright.async_api import async_playwright

DURATIONS = {
    "01_Hook_EdNex": 60.55,
    "02_Aura_Tiers": 47.33,
    "03_SignIn": 21.14,
    "04_Dashboard": 48.24,
    "05_GetAuraChat": 37.87,
    "06_Courses": 32.90,
    "07_Tutoring": 34.87,
    "08_Wellness": 25.51,
    "09_Holds": 22.37,
    "10_FinancialAid": 30.72,
    "11_SocialCampus": 22.58,
    "12_AdminPanel": 32.88,
    "13_TCO": 41.90,
    "14_Closing": 23.14,
}

BASE_URL   = "https://aumtech.ai"
DEMO_DIR   = os.path.dirname(os.path.abspath(__file__))
VIDEO_OUT  = os.path.join(DEMO_DIR, "recorded_browser.webm")

# Local files for intro architecture slides
DATA_ARCH_URL = "file:///c:/projects/2_architecture/DATA_ARCHITECTURE.html"
AURA_TIERS_URL = "file:///c:/projects/2_architecture/AURA_TIERS.html"

REC_WIDTH  = 1660
REC_HEIGHT = 980

def scene(name):
    print(f"\n[SCENE] {name}  ({DURATIONS[name]:.1f}s)", flush=True)

async def wait(page, seconds, label=""):
    if label:
        print(f"  -> {label} ({seconds:.1f}s)", flush=True)
    remaining = float(seconds)
    CHUNK = 5.0
    while remaining > 0:
        chunk = min(CHUNK, remaining)
        await page.wait_for_timeout(int(chunk * 1000))
        remaining -= chunk

async def heartbeat(page):
    await page.evaluate("""() => {
        const d = document.createElement('div');
        d.id = 'hb';
        d.style.cssText = 'position:fixed;bottom:0;right:0;width:1px;height:1px;z-index:99999;';
        document.body.appendChild(d);
        let f = 0;
        (function tick() { d.style.opacity = (f++ % 2) ? '0.99' : '1'; requestAnimationFrame(tick); })();
    }""")

async def safe_click(page, selector, timeout=4000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.click(selector)
        return True
    except:
        return False

async def safe_fill(page, selector, text, delay=55, timeout=4000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.click(selector)
        await page.type(selector, text, delay=delay)
        return True
    except:
        return False

async def slow_scroll(page, target_y, steps=10):
    await page.evaluate(f"""() => {{
        window.scrollTo({{ top: {target_y}, behavior: 'smooth' }});
    }}""")
    await page.wait_for_timeout(600)

async def highlight_element(page, selector, timeout=2000):
    try:
        await page.wait_for_selector(selector, timeout=timeout)
        await page.evaluate(f"""(sel) => {{
            const el = document.querySelector(sel);
            if (!el) return;
            el.style.transition = 'box-shadow 0.3s';
            el.style.boxShadow = '0 0 0 4px rgba(79,70,229,0.6)';
            setTimeout(() => {{ el.style.boxShadow = ''; }}, 1800);
        }}""", selector)
    except:
        pass

async def record_demo():
    print("[START] aumtech.ai Master Demo Recorder", flush=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=False, args=["--start-maximized", "--disable-infobars"])
        context = await browser.new_context(
            record_video_dir=DEMO_DIR,
            record_video_size={"width": REC_WIDTH, "height": REC_HEIGHT},
            viewport={"width": REC_WIDTH, "height": REC_HEIGHT},
        )
        page = await context.new_page()

        # 01 Hook
        scene("01_Hook_EdNex")
        await page.goto(DATA_ARCH_URL)
        await wait(page, 2)
        await heartbeat(page)
        await wait(page, DURATIONS["01_Hook_EdNex"] - 2, "EdNex Diagram")
        
        # 02 Tiers
        scene("02_Aura_Tiers")
        await page.goto(AURA_TIERS_URL)
        await wait(page, 2)
        await heartbeat(page)
        await wait(page, DURATIONS["02_Aura_Tiers"] - 2, "Aura Tiers Diagram")
        
        # 03 SignIn
        scene("03_SignIn")
        await page.goto(f"{BASE_URL}/login")
        await heartbeat(page)
        await wait(page, 2)
        email_sel = "input[type='email']"
        pass_sel  = "input[type='password']"
        await safe_fill(page, email_sel, "student@university.edu")
        await wait(page, 0.5)
        await safe_fill(page, pass_sel, "student123")
        await wait(page, 0.5)
        await highlight_element(page, "button[type='submit']")
        await safe_click(page, "button[type='submit']")
        try: await page.wait_for_selector(".sidebar, nav .nav-item", timeout=12000)
        except: pass
        await wait(page, DURATIONS["03_SignIn"] - 6, "wait settling")
        
        # 04 Dashboard
        scene("04_Dashboard")
        await heartbeat(page)
        await wait(page, 4)
        await slow_scroll(page, 300)
        await wait(page, 4)
        await highlight_element(page, ".card-white") # holds  
        await wait(page, 3)
        await slow_scroll(page, 0)
        await wait(page, DURATIONS["04_Dashboard"] - 11, "wait on dashboard")
        
        # 05 GetAura Chat
        scene("05_GetAuraChat")
        await safe_click(page, "text=Get Aura")
        await wait(page, 2)
        chat_input = "textarea, input[placeholder*='message']"
        await safe_fill(page, chat_input, "I failed my Calculus midterm and I think I'm losing my scholarship.")
        await page.keyboard.press("Enter")
        await wait(page, 8)
        await page.evaluate("window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})")
        await wait(page, DURATIONS["05_GetAuraChat"] - 10, "chat wait")

        # 06 Courses
        scene("06_Courses")
        await safe_click(page, "text=Courses")
        await wait(page, 4)
        await safe_click(page, "text=Degree Roadmap")
        await wait(page, DURATIONS["06_Courses"] - 4, "Roadmap")

        # 07 Tutoring
        scene("07_Tutoring")
        await safe_click(page, "text=Tutoring Center")
        await wait(page, 3)
        await safe_click(page, "button:has-text('Sync')")
        await wait(page, 3)
        await safe_click(page, ".card-white:first-child, [class*='card']:first-child")
        await wait(page, 1.5)
        await safe_fill(page, "textarea", "I am struggling with Python lists")
        await safe_fill(page, "input[type='date']", "2026-03-10", delay=20)
        await safe_fill(page, "input[type='time']", "14:00", delay=20)
        await wait(page, 1)
        await safe_click(page, "button[type='submit']:has-text('Confirm'), button:has-text('Book')")
        await wait(page, DURATIONS["07_Tutoring"] - 8.5, "booked")
        
        # 08 Wellness
        scene("08_Wellness")
        await safe_click(page, "text=Wellness")
        await wait(page, 2)
        await safe_click(page, "text=Study Timer")
        await wait(page, DURATIONS["08_Wellness"] - 2, "timer")

        # 09 Holds
        scene("09_Holds")
        await safe_click(page, "text=Holds")
        await wait(page, 5)
        await highlight_element(page, ".card-white")
        await wait(page, DURATIONS["09_Holds"] - 5, "holds screen")

        # 10 FinancialAid
        scene("10_FinancialAid")
        await safe_click(page, "text=Financial Nexus")
        await wait(page, 3)
        await safe_click(page, "text=AI Match")
        await wait(page, DURATIONS["10_FinancialAid"] - 3, "scholarships")

        # 11 SocialCampus
        scene("11_SocialCampus")
        await safe_click(page, "text=Social Campus")
        await wait(page, 3)
        await safe_click(page, "text=Textbook Marketplace")
        await wait(page, DURATIONS["11_SocialCampus"] - 3, "textbook")

        # 12 AdminPanel
        scene("12_AdminPanel")
        await safe_click(page, "text=Logout")
        await wait(page, 2)
        await safe_fill(page, email_sel, "admin@university.edu")
        await safe_fill(page, pass_sel, "admin123")
        await safe_click(page, "button[type='submit']")
        await wait(page, 3)
        await safe_click(page, "text=Admin Panel")
        await wait(page, DURATIONS["12_AdminPanel"] - 5, "admin risk tracking")

        # 13 TCO
        scene("13_TCO")
        await safe_click(page, "text=Quote Generator")
        await wait(page, 3)
        # Assuming there is a slider or we just scroll wait
        await slow_scroll(page, 300)
        await wait(page, 5)
        await safe_click(page, "text=Aura Vault")
        await wait(page, DURATIONS["13_TCO"] - 8, "ROI wait")
        
        # 14 Closing
        scene("14_Closing")
        await safe_click(page, "text=Dashboard")
        await slow_scroll(page, 0)
        await wait(page, DURATIONS["14_Closing"], "closing")

        print("\n[SAVING] Closing browser and saving video...", flush=True)
        raw_video = await page.video.path()
        await context.close()
        await browser.close()

        if os.path.exists(VIDEO_OUT): os.remove(VIDEO_OUT)
        shutil.copy(raw_video, VIDEO_OUT)
        print(f"[SAVED] Raw video: {VIDEO_OUT}", flush=True)

if __name__ == "__main__":
    asyncio.run(record_demo())
