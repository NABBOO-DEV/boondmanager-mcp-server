export interface UpdateInfo {
    current: string;
    latest: string;
    updateAvailable: boolean;
    releaseUrl: string;
}
export declare function checkForUpdate(opts: {
    currentVersion: string;
    packageName: string;
    timeoutMs?: number;
}): Promise<UpdateInfo | null>;
export declare function isUpdateCheckDisabled(): boolean;
export declare function runUpdateNotification(opts: {
    currentVersion: string;
    packageName: string;
    timeoutMs?: number;
}): Promise<void>;
//# sourceMappingURL=update-checker.d.ts.map