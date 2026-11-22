[CmdletBinding()]
param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Arguments
)

$repo = $PSScriptRoot
$env:PYTHONPATH = "$repo;$env:PYTHONPATH"

# Prefer the managed python if installed, else fallback to PATH python
$pyCandidates = @(
    "$env:LOCALAPPDATA\rubimind\tools\python-3.14.9+20261021-win32-x64\python.exe",
    "$env:LOCALAPPDATA\hermes\tools\python-3.14.9+20261021-win32-x64\python.exe",
    "$repo\.venv\Scripts\python.exe",
    "$repo\venv\Scripts\python.exe"
)

$pyExe = $null
foreach ($cand in $pyCandidates) {
    if (Test-Path $cand) {
        $pyExe = $cand
        break
    }
}

if (-not $pyExe) {
    $toolsPy = Get-ChildItem -Path "$env:LOCALAPPDATA\hermes\tools" -Filter "python.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    if (-not $toolsPy) {
        $toolsPy = Get-ChildItem -Path "$env:LOCALAPPDATA\rubimind\tools" -Filter "python.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty FullName
    }
    if ($toolsPy -and (Test-Path $toolsPy)) {
        $pyExe = $toolsPy
    } else {
        $pyExe = "python"
    }
}

& $pyExe -m hermes_cli.main @Arguments
