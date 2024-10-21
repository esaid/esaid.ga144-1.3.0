import os
import sys
import subprocess

# Afficher le répertoire courant (pour le débogage)
# print("Le répertoire courant est :", os.getcwd())


# Déterminer le système d'exploitation
if os.name == 'nt':  # Windows
    script = 'ga144_script/windows/ga.exe'  # Assurez-vous que le chemin est correct
if os.name == 'posix':  # Linux ou autre
    script = 'ga144_script/linux/./ga'  # Assurez-vous que le chemin est correct

# Récupérer les arguments à passer au script
args = sys.argv[1:]  # Arguments fournis à run_script.py

# Afficher le script et les arguments (pour le débogage)
# print(f"Exécution de : {script} avec les arguments : {args}")

# Exécuter le script avec les arguments
subprocess.run([script] + args)
