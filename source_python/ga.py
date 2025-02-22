#!/usr/bin/env python3
# -*- python -*-

# ::::GA*
# ::::Tools

import argparse
import os
import sys

import ga_tools

print('::::GA*Tools Version', ga_tools.version)
parser = argparse.ArgumentParser()
parser.add_argument('file', nargs='?', help='input file')
parser.add_argument('--bootstream',
                    nargs=1,
                    help='Bootstream type. Default=708')
parser.add_argument('--port',
                    nargs=1,
                    help='Serial port')
parser.add_argument('--baud',
                    nargs=1,
                    default=[460800],
                    help='Serial port baud rate. Default=460800')
parser.add_argument('--json',
                    nargs=-1,
                    help='Dump compiled data in json format')
parser.add_argument('--outfile',
                    nargs=1,
                    help='filename to write json data to')
parser.add_argument('--print',
                    nargs=-1,
                    help='Pretty print assembled node data')
parser.add_argument('--no-listen',
                    nargs=-1,
                    help='Wait for and print data from serial port')
parser.add_argument('--size',
                    nargs=-1,
                    help='Count node ram usage')
parser.add_argument('--disable-0-opt',
                    nargs=-1,
                    help="Don't compile '0' as 'dup dup or'")
parser.add_argument('--disable-plus-opt',
                    nargs=-1,
                    help="Don't auto insert nops before + or +*")
parser.add_argument('--print-simple',
                    nargs=-1,
                    help='Simple assembly output usefull for diffs')
parser.add_argument('--node',
                    nargs=1,
                    help='Selects a single node for print options')
parser.add_argument('--sim',
                    nargs=-1,
                    help='Run the GA144 simulator')
parser.add_argument('--dis',
                    nargs=1,
                    help='Disassemble an 18-bit word')
parser.add_argument('--version',
                    nargs=-1,
                    help='GA-tools version')
args = parser.parse_args()

if args.version is not None:
    print(':::GA*Tools', ga_tools.version)
    sys.exit(0)

if args.dis:
    word = int(args.dis[0]) & 0x3ffff
    print(word, '   ', ga_tools.disasm_to_str(word))
    sys.exit(0)

print_json = args.json is not None
print_pretty = args.print is not None or args.print_simple is not None
print_size = args.size is not None
select_node = None
outfile = args.outfile[0] if args.outfile else None

if args.node:
    select_node = int(args.node[0])
    if not ga_tools.valid_coord(select_node):
        print('Invalid --node coordinate:', select_node)
        sys.exit(0)

ga_tools.optimize_0(args.disable_0_opt is None)
ga_tools.optimize_plus(args.disable_plus_opt is None)

if not args.file:
    parser.print_help()
    sys.exit(0)

ga_tools.set_baud(int(args.baud[0]))

ga_tools.include_file(args.file)
ga_tools.do_compile()

chips = list(ga_tools.get_chips().values())

if len(chips) > 2:
    raise Exception('More than 2 chips are not supported yet')

multiple_chips = len(chips) > 1
if not chips:
    sys.exit(0) # empty file

bootstream_type = args.bootstream
if bootstream_type is None:
    bootstream_type = '708-300' if multiple_chips else '708'
else:
    bootstream_type = args.bootstream[0]

if print_size:
    for chip in chips:
        chip.print_size(multiple_chips)
    sys.exit(0)

def do_pretty_print():
    ga_tools.print_nodes(args.print_simple is not None, select_node)

if print_pretty:
    do_pretty_print()
    sys.exit(0)

if args.sim is not None:
    if multiple_chips:
        print('Multiple chips are not supported in simulation')
        sys.exit(0)
    import tempfile
    print_json = True
    outfile = tempfile.NamedTemporaryFile().name

if print_json:
    #TODO: json for multiple chips
    chip = chips[0]
    import json
    bs = None
    if args.bootstream is not None:
        bs = bootstream_type
    data = ga_tools.chip_json(chip, bs, args.sim is not None)
    data['version'] = ga_tools.version
    data['file'] = os.path.abspath(args.file)
    dump = json.dumps(data)
    if outfile:
        f = open(outfile, 'w')
        f.write(dump)
        f.close()
    else:
        print(dump)
    if args.sim is None:
        sys.exit(0)

if args.sim is not None:
    import subprocess
    subprocess.call(["ga-sim", outfile])
    sys.exit(0)

if not args.port:
    do_pretty_print()
    sys.exit(0)

serial = ga_tools.GA144Serial(chips, args.port[0], args.baud[0])
serial.write_bootstream(bootstream_type)
if args.no_listen is None:
    serial.listen()