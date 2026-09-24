$baselineFile = ".any-baseline"
if (-not (Test-Path $baselineFile)) {
    Write-Error "Baseline file $baselineFile not found!"
    exit 1
}

$baseline = [int](Get-Content $baselineFile).Trim()
$matches = git grep -E "(: *any\b|\bas +any\b|<any>)" -- src ":!src/routeTree.gen.ts"
$count = if ($matches) { ($matches | Measure-Object -Line).Lines } else { 0 }

Write-Host "Current 'any' count: $count (Baseline: $baseline)"

if ($count -gt $baseline) {
    Write-Error "Error: 'any' count increased from $baseline to $count! Ratchet failed."
    exit 1
}

Write-Host "Ratchet passed: $count <= $baseline."
exit 0
