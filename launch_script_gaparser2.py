import os
import sys
import subprocess

# Afficher le répertoire courant (pour le débogage)
# print("Le répertoire courant est :", os.getcwd())
# Récupérer les arguments à passer au script
args = sys.argv[1:]  # Arguments fournis
# repertoire de l extension
# print(f"repertoire extension  = {sys.argv[1]}")
ga_script = 'ga144_script'
# print(f"ga_script = {ga_script}")
# Déterminer le système d'exploitation
if os.name == 'nt':  # Windows
    script = os.path.join( ga_script, 'windows', 'gaparser2.exe')
    args = [arg.replace('/', '\\') for arg in args]  # Remplacer / par \ pour Windows
    
if os.name == 'posix':  # Linux ou autre
    script = os.path.join( ga_script,'linux', './gaparser2')
    args = [arg.replace('\\', '/') for arg in args]   # Remplacer \ par / pour Linux

# Afficher le script et les arguments (pour le débogage)
# print(f"Exécution de : {script} avec les arguments : {args}")

# Exécuter le script avec les arguments
subprocess.run([script] + args)
