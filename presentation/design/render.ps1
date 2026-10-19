param([string]$Deck, [string]$OutDir)
$app = New-Object -ComObject PowerPoint.Application
$p = $app.Presentations.Open((Resolve-Path $Deck).Path, $true, $false, $false)
if (Test-Path $OutDir) { Remove-Item -Recurse -Force $OutDir }
New-Item -ItemType Directory -Force $OutDir | Out-Null
$p.Export((Resolve-Path $OutDir).Path, 'PNG', 1600, 900)
Write-Output ("slides " + $p.Slides.Count)
$p.Close(); $app.Quit()
