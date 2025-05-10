import { plainToClass } from "class-transformer";

export class Failure {
  message: string;
  code: number;

  static fromJson(json: any): Failure {
    return plainToClass(Failure, json);
  }
}
