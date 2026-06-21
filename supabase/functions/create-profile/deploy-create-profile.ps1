param(
  [Parameter(Mandatory=$false)]
  [string]$ProjectRef,

  [Parameter(Mandatory=$false)]
  [string]$ServiceRoleKey
)

if (-not $ProjectRef) {
  $projects = supabase projects list -o json | ConvertFrom-Json
  if ($projects -and $projects.Count -gt 0) {
    Write-Output "Available project refs:";
    $projects | ForEach-Object { Write-Output "  $($_.ref) - $($_.name)" }
    $ProjectRef = Read-Host "Enter project ref to use"
  } else {
    throw "No projects found. Please provide --ProjectRef or run 'supabase projects list'"
  }
}

supabase secrets set SUPABASE_URL="$SUPABASE_URL" --project-ref $ProjectRef
if (-not $ServiceRoleKey) {
  $ServiceRoleKey = Read-Host -AsSecureString "Enter SERVICE_ROLE_KEY" | ConvertFrom-SecureString -AsPlainText
}

# Set secrets (note: secret names cannot start with SUPABASE_ via CLI)
Write-Output "Setting service role secret for project $ProjectRef (secret name: SERVICE_ROLE_KEY)..."
supabase secrets set SERVICE_ROLE_KEY="$ServiceRoleKey" --project-ref $ProjectRef

# Set PROJECT_URL (function can read PROJECT_URL or SUPABASE_URL)
$PROJECT_URL = "https://$ProjectRef.supabase.co"
supabase secrets set PROJECT_URL="$PROJECT_URL" --project-ref $ProjectRef

# Deploy function
Write-Output "Deploying create-profile function to project $ProjectRef..."
supabase functions deploy create-profile --project-ref $ProjectRef

Write-Output "Deployment complete. You can test the function at: https://$ProjectRef.functions.supabase.co/create-profile"
