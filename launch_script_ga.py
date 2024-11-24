import os
import sys
import subprocess


# Afficher le répertoire courant (pour le débogage)
# print("Le répertoire courant est :", os.getcwd())
# print("Le répertoire courant est :", os.getcwd())
# Récupérer les arguments à passer au script
args = sys.argv[1:]  # Arguments fournis à run_script.py

# Déterminer le système d'exploitation
if os.name == 'nt':  # Windows
    script = os.path.join( 'ga144_script', 'windows', 'ga.exe')
    args = [arg.replace('/', '\\') for arg in args]  # Remplacer / par \ pour Windows
if os.name == 'posix':  # Linux ou autre
    script = os.path.join('ga144_script','linux', './ga')
    args = [arg.replace('\\', '/') for arg in args]   # Remplacer \ par / pour Linux


# Afficher le script et les arguments (pour le débogage)
# print(f"Exécution de : {script} avec les arguments : {args}")

# Exécuter le script avec les arguments
subprocess.run([script] + args)
