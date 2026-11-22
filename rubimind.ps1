[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$repo = $PSScriptRoot
$env:PYTHONPATH = "$repo;$env:PYTHONPATH"

# Run through python module
& python -m rubimind_cli.main @Arguments
