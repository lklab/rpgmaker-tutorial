# tools/prettify_json.py

if __name__ == "__main__":
    from pathlib import Path
    import sys

    path_root = Path(__file__).resolve().parent
    while path_root.name != 'tools' :
        path_root = path_root.parent

    sys.path.append(str(path_root.parent))

import os
import json
import sys

from tools.restorers import restorers

data_dir = "data"

def prettify_json_file(filepath: str):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)

        restorer = restorers.get(filepath.replace('\\', '/'))
        if restorer :
            restorer.backup(data)

        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        return True

    except Exception as e:
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
