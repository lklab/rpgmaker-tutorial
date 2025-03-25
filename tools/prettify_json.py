# tools/prettify_json.py

import os
import json
import sys

data_dir = "data"

def prettify_json_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"✅ prettified: {filepath}")
        return True
    except Exception as e:
        print(f"❌ Error prettifing {filepath}: {e}")
        return False

def main():
    success = True
    for filename in os.listdir(data_dir):
        if filename.endswith(".json"):
            full_path = os.path.join(data_dir, filename)
            if not prettify_json_file(full_path):
                success = False
    if not success:
        sys.exit(1)

if __name__ == "__main__":
    sys.stdout.reconfigure(encoding='utf-8')
    main()
