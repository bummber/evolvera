export type TitleRequest = Readonly<{
  seed: string;
  lexiconVersion: string;
  parentTitles: readonly string[];
}>;
export type TitleResult = Readonly<{
  title: string;
  tokens: readonly string[];
}>;
export type TitleGenerator = (request: TitleRequest) => TitleResult;
// Implementation and lexicon follow in Phase 2.
