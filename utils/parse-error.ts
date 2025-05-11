export function parseError(e: any): string {
  if (e instanceof Error) {
    let error = e.message;

    if (error.includes(": ")) {
      error = error.split(": ")[1];
    }

    if (error.includes(".")) {
      error = error.split(".")[0];
    }

    return error;
  }

  return "Something went wrong";
}
