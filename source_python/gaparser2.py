import sys
import argparse
from bibliotheque_create import read_file, generation_code

# python /home/esaid/.vscode/extensions/esaid.ga144-1.3.0/launch_script_gaparser2.py
# -dl /home/esaid/.vscode/extensions/esaid.ga144-1.3.0/Libraries/
# -d /home/esaid/.vscode/extensions/esaid.ga144-1.3.0/examples/
# -f ledpulse.ga
# -e /home/esaid/.vscode/extensions/esaid.ga144-1.3.0
# -------------------------------------------------------------------
# repertoire / initialisation
file_source = ''
directoryBibliotheque = ''
directoryExamples = ''

comserial = "/dev/ttyUSB0"  # le port serie
compilega144 = True  # permet de voir sous forme json le resultat de la compilation
programga144 = False  # programmation du ga144

# -------------------------------------------------------------------
# file_source = "ledpulse.ga"
# file_source = "inputwakeup.ga"
# file_source = "fibonacci.ga"

# fichiers code source


parser = argparse.ArgumentParser(description="repertoire fichier source ")
parser.add_argument('-dl', '--directory_Libraries', type=str, required=True, help='Répertoire librairies')
parser.add_argument('-d', '--directory', type=str, required=True, help='Répertoire de travail')
parser.add_argument('-f', '--file', type=str, required=True, help='Nom du fichier')
args = parser.parse_args()
if args.file:
    file_source = args.file
if args.directory:
    directoryExamples = args.directory
if args.directory_Libraries:
    directoryBibliotheque = args.directory_Libraries


file_ga =  directoryExamples + file_source
file_source_ga = file_source.replace('.ga', '_.ga')
file_ga_ = directoryExamples + file_source_ga
print("file source:    ",file_ga)
# read code source
code = read_file(file_ga)
print(f"code: \n{code}")

# new code
generation_code(code, directoryBibliotheque, file_ga_)
newcode = read_file(file_ga_)
print(f"file modifiee : {file_ga_}\n")
print(f"nouveau code: \n{newcode}")
sys.exit()


# -------------------------------------------------------------------
def ecrire_fichier(result_, file_):
    # Vérifier si la commande s'est exécutée avec succès
    if result_.returncode == 0:
        # Ouvrir le fichier en mode écriture
        with open(directoryExamples+ file_, "w") as file:
            file.write(result_.stdout)  # Écrire la sortie standard dans le fichier
    else:
        print("La commande a échoué avec le code de retour:", result_.returncode)
        print("Erreur:", result_.stderr)


# compilation / programmation
if compilega144:
    # "python ga.py examples/boutoninput_.ga --json"

    commandecompile = "python ga.py " + file_ga_

    # Exécuter la commande et capturer la sortie
    result = subprocess.run(commandecompile, shell=True, capture_output=True, text=True)
    ecrire_fichier(result, "assembleur_" + file_source)
    # os.system(commandecompile)
if programga144:
    commandprogram = "python ga.py " + file_ga_ + " --port " + comserial
    result = subprocess.run(commandprogram, shell=True, capture_output=True, text=True)
    ecrire_fichier(result, "prg_" + file_source)

    # os.system(commandprogram)
# -------------------------------------------------------------------
