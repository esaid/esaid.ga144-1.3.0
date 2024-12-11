import os
import sys
import subprocess
# python /home/esaid/.vscode/extensions/esaid.ga144-1.3.0/launch_script_ga.py 
#  -f /home/esaid/PycharmProjects/gaparser2/examples/ledpulse.ga 
#  -e .vscode/extensions/esaid.ga144-1.3.0
# Récupérer les arguments à passer au script
args = sys.argv # Liste initiale des arguments
# print(f"Arguments initiaux : {args}\n")

args = args[1:]
# Prendre le dernier argument
pathExtension = args[-1:][0].strip()
# print(f"\n\npathExtension : {pathExtension}\n")
# Supprimer le dernier argument
args = args[:-2] # suppression de l'argument 'pathExtension'
args = args[1:] # suppression de '-f'
# print(f"\n\nArguments restants : {args}\n")

ga_script = os.path.join(pathExtension, 'ga144_script/')  # Chemin vers le dossier 'ga144_script'
# print(f"\nga_script = {ga_script}\n")

# Déterminer le système d'exploitation
if os.name == 'nt':  # Windows
    ga_script = os.path.join(pathExtension,'ga144_script', 'windows', 'ga.exe').replace("/", os.sep) # Remplacer / par \ pour Windows
    args = [arg.replace('/', os.sep) for arg in args]  # Remplacer / par \ pour Windows
if os.name == 'posix':  # Linux ou autre
    ga_script = os.path.join(pathExtension,'ga144_script','linux', './ga').replace("\\", os.sep)
    args = [arg.replace('\\', os.sep) for arg in args]   # Remplacer \ par / pour Linux
commande = [ga_script] + args

# Afficher le script et les arguments (pour le débogage)
# print(f"Exécution de : {ga_script} avec les arguments : {args}")
# print(f"type arguments : {type(args)}")
# Exécuter le script avec les arguments
subprocess.run(commande)
