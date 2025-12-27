import json
from pathlib import Path
from datetime import datetime
import threading

LOG_FILE = Path("logs/email_logs.json")
LOCK = threading.Lock()

def log_email_entry(entry: dict):
    LOG_FILE.parent.mkdir(exist_ok=True)

    with LOCK:
        if LOG_FILE.exists():
            with open(LOG_FILE, "r", encoding="utf-8") as f:
                try:
                    data = json.load(f)
                except:
                    data = []
        else:
            data = []

        data.append(entry)

        with open(LOG_FILE, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
