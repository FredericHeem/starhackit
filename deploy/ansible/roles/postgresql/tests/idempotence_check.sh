#!/bin/bash

# Process the output of the given file (should contain a plays stdout/err)
# If we pass, return with 0 else return with 1, and print useful output

_file="$1"

# Assert filename has been passed
[ $# -eq 0 ] && { echo "Usage: $0 filename"; exit 1; }

# Assert file exists
[ ! -f "$_file" ] && { echo "$0: $_file file not found."; exit 2; }

# Make sure nothing has changed or failed
grep -q 'changed=0.*failed=0' $_file

# Success condition
if [ $? -eq 0 ]; then
    echo 'Idempotence test: pass'
    exit

# Failure condition, extract useful information and exit
else
    echo 'Idempotence test: fail'
    echo ''
    grep --color=auto -B1 -A1 "\(changed\|failed\):" $_file
    exit 1
fi
