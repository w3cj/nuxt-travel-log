import type { User } from "better-auth";

declare module "h3" {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface H3EventContext {
    user?: Omit<User, "id"> & {
      id: number;
    };
  }
}
