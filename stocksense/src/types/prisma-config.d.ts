declare module "prisma/config" {
  export interface PrismaConfig {
    [key: string]: any;
  }
  export function definePrismaConfig<T extends PrismaConfig>(config: T): T;
}
