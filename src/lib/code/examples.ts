import { Dataset } from "../utils";

export enum CodeExampleType {
  LOAD_DATASET = "LOAD_DATASET",
  PARSE_DATASET = "PARSE_DATASET",
}

export enum ModelExampleType {
  LOAD_HF_MODEL = "LOAD_HF_MODEL",
}

export const codeExampleTypesNames: Record<
  CodeExampleType | ModelExampleType,
  string
> = {
  [CodeExampleType.LOAD_DATASET]: "Load dataset",
  [CodeExampleType.PARSE_DATASET]: "Process dataset",
  [ModelExampleType.LOAD_HF_MODEL]: "Load Hugging Face model",
};

export const loadDatasetExample = `from dcat_ap_hub import Dataset

url = "{url}"

ds = Dataset.from_url(url)
files = ds.download(data_dir="./data")`;

export const processDatasetExample = `from dcat_ap_hub import Dataset

url = "{url}"

ds = Dataset.from_url(url)
ds.download(data_dir="./data")
files = ds.process(processed_dir="./processed")`;

export const loadHfModelExample = `from dcat_ap_hub import Dataset

url = "{url}"

ds = Dataset.from_url(url)
ds.download(data_dir="./data")
model, processor, metadata = ds.load_model(model_dir="./models")`;

export const installationExample = `pip install dcat-ap-hub`;

export function getRawCodeExample(type: CodeExampleType | ModelExampleType) {
  switch (type) {
    case CodeExampleType.LOAD_DATASET:
      return loadDatasetExample;
    case CodeExampleType.PARSE_DATASET:
      return processDatasetExample;
    case ModelExampleType.LOAD_HF_MODEL:
      return loadHfModelExample;
    default:
      return loadDatasetExample;
  }
}

export function extractParserRepository(
  dataset: Dataset,
  translateDict: (item?: string | Record<string, string> | null) => string,
): string | undefined {
  return dataset.distributions
    ?.find((d) => translateDict(d.title).toLowerCase() === "parser repository")
    ?.access_url?.at(0);
}

export function getInstallationExample(
  customParser: string | undefined,
  exampleType: CodeExampleType | ModelExampleType,
) {
  if (customParser && exampleType === CodeExampleType.PARSE_DATASET) {
    var example = installationExample;

    if (customParser.startsWith("https://")) {
      customParser = `git+${customParser}`;
    } else {
      customParser = `${customParser}`;
    }

    example += `\npip install ${customParser}`;

    return example;
  }

  return installationExample;
}

export function getCodeExample(
  type: CodeExampleType | ModelExampleType,
  url: string,
) {
  const rawExample = getRawCodeExample(type);
  return formatExample(rawExample, url);
}

export function formatExample(example: string, url: string): string {
  return example.replace("{url}", url);
}
