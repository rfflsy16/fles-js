export function createTypesIndexTs(): string {
    return `import { FlesRequest, FlesResponse, BaseEntity, BaseRepository, BaseService } from "fles-js";

// Controller type for route handlers
export type Controller = (req: FlesRequest, res: FlesResponse) => Promise<void> | void;

// Add your custom types here
`;
}
