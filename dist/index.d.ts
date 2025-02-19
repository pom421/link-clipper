export interface ClipOptions {
    tags?: string[];
    comment?: string;
    outputDir?: string;
    url: string;
}
export declare function clipLink({ url, tags, comment, outputDir }: ClipOptions): Promise<string>;
