import { signInWithEmailAndPassword } from "firebase/auth";
import { User } from "~/entities/user.type";
import { UserRepository } from "./user.repository";

export const AUTHSECRET = (key: string) => "iniadalahrahasiaruangtulis" + key;

export class AuthRepository {
  static async init(): Promise<User | undefined> {
    try {
      const user = await UserRepository.get(
        localStorage.getItem(AUTHSECRET("authid"))
      );

      return user;
    } catch (e) {
      //
    }
  }

  static async login(props: {
    email: string;
    password: string;
  }): Promise<User> {
    const result = await signInWithEmailAndPassword(
      auth,
      props.email,
      props.password
    );

    const user = await UserRepository.getByEmail(
      result.user.email ?? props.email
    );

    localStorage.setItem(AUTHSECRET("authid"), user.id);

    return user;
  }
}
