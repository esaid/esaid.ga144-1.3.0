import os
import sys
import subprocess


# Afficher le répertoire courant (pour le débogage)
# print("Le répertoire courant est :", os.getcwd())
# Récupérer les arguments à passer au script
args = sys.argv
args = args[1:]  # Arguments fournis à run_script.py

pathExtension = args[-1:][0].strip()
# Supprimer le dernier argument
args = args[:-1] # suppression de l'argument 'pathExtension'
print(f"\n\npathExtension : {pathExtension}\n")
ga_script = os.path.join(pathExtension, 'ga144_script/')  # Chemin vers le dossier 'ga144_script'

# Déterminer le système d'exploitation
if os.name == 'nt':  # Windows
    ga_script = os.path.join(pathExtension,'ga144_script', 'windows', 'ga.exe').replace("/", os.sep) # Remplacer / par \ pour Windows
    args = [arg.replace('/', os.sep) for arg in args]  # Remplacer / par \ pour Windows
if os.name == 'posix':  # Linux ou autre
    ga_script = os.path.join(pathExtension,'ga144_script','linux', './ga')
    args = [arg.replace('\\', '/') for arg in args]   # Remplacer \ par / pour Linux

commande = [ga_script] + args


# Afficher le script et les arguments (pour le débogage)
print(f"Exécution de : {ga_script} avec les arguments : {args}")

# Exécuter le script avec les arguments
subprocess.run(commande)
