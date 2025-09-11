
export enum CodeExampleType {
  CUSTOM_PARSING = "CUSTOM_PARSING",
  PANDAS_PARSING = "PANDAS_PARSING",
}

export const codeExampleTypesNames: Record<CodeExampleType, string> = {
  [CodeExampleType.CUSTOM_PARSING]: "Custom parsing",
  [CodeExampleType.PANDAS_PARSING]: "Pandas parsing",
}

export const customParsingExample = `from dcat_ap_hub import 
  download_data, apply_parsing

json_ld_metadata = "{url}"
metadata = download_data(json_ld_metadata)
df = apply_parsing(metadata)`

export const pandasParsingExample = `from dcat_ap_hub import download_data, parse_with_pandas

json_ld_metadata = "{url}"
metadata = download_data(json_ld_metadata)
df = parse_with_pandas(metadata)`

export const installationExample = `pip install git+https://github.com/maxbrzr/dcat-ap-hub.git`

export function getRawCodeExample(type: CodeExampleType) {
  switch (type) {
    case CodeExampleType.CUSTOM_PARSING:
      return customParsingExample;
    case CodeExampleType.PANDAS_PARSING:
      return pandasParsingExample;
    default:
      return customParsingExample;
  }
}

export function getCodeExample(type: CodeExampleType, url: string) {
  const rawExample = getRawCodeExample(type);
  return formatExample(rawExample, url);
}

export function formatExample(example: string, url: string): string {
  return example.replace("{url}", url);
}