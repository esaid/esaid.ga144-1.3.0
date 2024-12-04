# -*- mode: python ; coding: utf-8 -*-

block_cipher = None


a = Analysis(['gaparser2.py'],
             pathex=['C:\\Users\\esaid\\AppData\\Roaming\\Python\\Python312\\site-packages', 'C:\\Users\\esaid\\.vscode\\extensions\\esaid.ga144-1.3.0\\source_python'],
             binaries=[],
             datas=[],
             hiddenimports=['python_util'],
             hookspath=[],
             runtime_hooks=[],
             excludes=[],
             win_no_prefer_redirects=False,
             win_private_assemblies=False,
             cipher=block_cipher,
             noarchive=False)
pyz = PYZ(a.pure, a.zipped_data,
             cipher=block_cipher)
exe = EXE(pyz,
          a.scripts,
          a.binaries,
          a.zipfiles,
          a.datas,
          [],
          name='gaparser2',
          debug=False,
          bootloader_ignore_signals=False,
          strip=False,
          upx=True,
          upx_exclude=[],
          runtime_tmpdir=None,
          console=True )
