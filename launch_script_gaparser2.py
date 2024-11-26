import os
import sys
import subprocess
import shlex


# Récupérer les arguments passés au script
args = sys.argv # Liste initiale des arguments
print(f"Arguments initiaux : {args}\n")

# Découper les arguments (en cas de chaîne unique avec options groupées)
#if len(args) > 1:
#    args = [args[0]] + shlex.split(args[1])

args = args[1:]
# Prendre le dernier argument
pathExtension = args[-1:]
print(f"\n\npathExtension : {pathExtension}\n")
# Supprimer le dernier argument
args = args[:-2]
print(f"\n\nArguments restants : {args}\n")

ga_script = os.path.join(pathExtension[0], 'ga144_script')  # Chemin vers le dossier 'ga144_script'
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
