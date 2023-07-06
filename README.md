# Upload BOM to SSCSB action

This action uploads a software bill of materials file to a SSCSB server.

## Inputs

### `serverhostname`

**Required** SSCSB hostname

### `port`

Defaults to 443

### `protocol`

Can be `https` or `http`

Defaults to `https`

### `apikey`

**Required** SSCSB API key

### `project`

**Required, unless projectname and projectversion are provided** Project uuid in SSCSB

### `projectname`

**Required, unless project is provided** Project name in SSCSB

### `projectversion`

**Required, unless project is provided** Project version in SSCSB

### `autocreate`

Automatically create project and version in SSCSB, default `false`

### `bomfilename`

Path and filename of the BOM, default `bom.xml`

## Example usage

With project name and version:
```
uses: sscsb/action-sbom-upload@v2.0.0
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.SSCSB_APIKEY }}
  projectname: 'Example Project'
  projectversion: 'master'
```

With project uuid:
```
uses: sscsb/action-sbom-upload@v2.0.0
with:
  serverhostname: 'example.com'
  apikey: ${{ secrets.SSCSB_APIKEY }}
  project: 'dadec8ad-7053-4e8c-8044-7b6ef698e08d'
```
