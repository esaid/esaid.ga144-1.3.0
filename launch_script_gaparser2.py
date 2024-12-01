import os
import sys
import subprocess

script = ''
#  python /home/esaid/.vscode/extensions/esaid.ga144-1.3.0/launch_script_gaparser2.py
#  ['-dl', '/home/esaid/.vscode/extensions/esaid.ga144-1.3.0/Libraries/',
#  '-d', '/home/esaid/.vscode/extensions/esaid.ga144-1.3.0/examples/',
#  '-f', 'ledpulse.ga'
# '-e', '/home/esaid/.vscode/extensions/esaid.ga144-1.3.0']
# Récupérer les arguments passés au script
args = sys.argv # Liste initiale des arguments
print(f"Arguments initiaux : {args}\n")


args = args[1:]
# Prendre le dernier argument
pathExtension = args[-1:][0].strip()
print(f"\n\npathExtension : {pathExtension}\n")
# Supprimer le dernier argument
args = args[:-2]
print(f"\n\nArguments restants : {args}\n")

ga_script = os.path.join(pathExtension, 'ga144_script/')  # Chemin vers le dossier 'ga144_script'
print(f"\nga_script = {ga_script}\n")

# Déterminer le système d'exploitation
if os.name == 'nt':  # Windows
    script = os.path.join( ga_script, 'windows', 'gaparser2.exe')
    args = [arg.replace('/', '\\') for arg in args]  # Remplacer / par \ pour Windows
    
if os.name == 'posix':  # Linux ou autre
    script = os.path.join( ga_script,'linux', './gaparser2')
    args = [arg.replace('\\', '/') for arg in args]   # Remplacer \ par / pour Linux

# Afficher le script et les arguments (pour le débogage)
print(f"\nExécution de : {script} avec les arguments : {args}\n")

# Exécuter le script avec les arguments
subprocess.run([script] + args)
