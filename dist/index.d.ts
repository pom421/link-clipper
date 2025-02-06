export interface ClipOptions {
    outputDir: string;
}
export declare function clipLink(url: string, options?: ClipOptions): Promise<string>;
