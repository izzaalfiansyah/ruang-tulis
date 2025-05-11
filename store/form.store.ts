import { object, ZodError, ZodObject } from "zod";

export const formStore = defineStore("form", {
  state: (): {
    schema: ZodObject<any>;
    errors: Record<string, string>;
  } => ({
    schema: object({}),
    errors: {},
  }),
  actions: {
    setSchema(schema: ZodObject<any>) {
      this.schema = schema;
    },
    setError(key: string, message: string) {
      this.errors[key] = message;
    },
    validate(data: Record<string, any>): boolean {
      this.errors = {};

      try {
        this.schema.parse(data);

        return true;
      } catch (e: any) {
        if (e instanceof ZodError) {
          e.errors.forEach((err) => {
            this.errors[err.path[0]] = err.message;
          });
        }

        return false;
      }
    },
  },
});
