

export const customParsingExample = `from dcat_ap_hub import 
  download_data, apply_parsing

json_ld_metadata = "{url}"
metadata = download_data(json_ld_metadata)
df = apply_parsing(metadata)`

export function formatExample(example: string, url: string): string {
  return example.replace("{url}", url);
}