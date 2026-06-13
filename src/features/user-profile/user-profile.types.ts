import type { ProfileRecord } from "../../core/repositories";

/**
 * The profile shape returned by this feature. It is the repository's domain
 * record — the feature does not redefine the data model, it consumes the core
 * contract. (Kept as an alias so the public type name is unchanged.)
 */
export type UserProfile = ProfileRecord;

/** Fields a user is allowed to change on their own profile. */
export interface UpdateProfileInput {
  readonly displayName?: string;
}
