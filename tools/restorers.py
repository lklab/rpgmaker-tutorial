"""
restorer.py

Description:
이 스크립트는 RPG Maker MZ 프로젝트에서 json 파일의 일부 값을 커밋 전후에 자동으로 백업 및 복구하여
git 충돌 가능성을 줄이는 데 사용됩니다. 

구체적으로는 git 커밋 전에 다음과 같은 작업을 수행합니다:
- 충돌이 잦은 동적 값들을 고정된 값으로 되돌립니다.
- 이 파일에서 제어하는 값들을 수정해서 git 저장소에 올리려면 이 파일 내에서 직접 값을 변경해야 합니다.

Author: Connor
"""

import os
import json

backup_dir = 'temp/json_backups'

class Restorer :
    def __init__(self, name) :
        self.name = name
        self.path = os.path.join(backup_dir, self.name + '.json')

    def save(self, data) :
        os.makedirs(backup_dir, exist_ok=True)
        with open(self.path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False)

    def restore(self) -> dict :
        with open(self.path, 'r', encoding='utf-8') as f:
            return json.load(f)

    def backup(self, data: dict) :
        pass

class SystemRestorer(Restorer) :
    def __init__(self) :
        super().__init__('System')

    def backup(self, data) :
        self.save(data)

        data['versionId'] = 30150186

class MapInfosRestorer(Restorer) :
    def __init__(self) :
        super().__init__('MapInfos')

    def backup(self, data) :
        self.save(data)

        for map in data :
            if map :
                map['expanded'] = True
                map['scrollX'] = 0
                map['scrollY'] = 0

restorers: dict[str, Restorer] = {
    'data/System.json' : SystemRestorer(),
    'data/MapInfos.json' : MapInfosRestorer(),
}
