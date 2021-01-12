declare module 'nyc' {
  export default class NYC {
    constructor(config): void;
    instrumenter(): void;
    addFile(filename): void;
    async addAllFiles(): Promise<void>;
    async instrumentAllFiles(input, output): Promise<void>;
    maybePurgeSourceMapCache(): void;
    async createTempDirectory(): Promise<void>;
    async reset(): Promise<void>;
    wrap(bin?): void;
    writeCoverageFile(): void;
    async getCoverageMapFromAllCoverageFiles(baseDirectory): Promise<unknown>;
    async report(): Promise<void>;
    async writeProcessIndex(): Promise<void>;
    async showProcessTree(): Promise<void>;
    async checkCoverage(thresholds, perFile): Promise<void>;
    coverageFiles(baseDirectory = this.tempDirectory()): Promise<unknown>;
    async coverageFileLoad(filename, baseDirectory = this.tempDirectory()): Promise<unknown>;
    tempDirectory(): string;
    reportDirectory(): string;
  }
}
