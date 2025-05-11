import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { User } from "~/entities/user.type";
import { UserRepository } from "./user.repository";
import { v4 } from "uuid";

export const AUTHSECRET = (key: string) => "iniadalahrahasiaruangtulis" + key;

export interface LoginParams {
  email: string;
  password: string;
}

export interface RegisterParams {
  email: string;
  password: string;
  password_confirm: string;
  name: string;
}

export class AuthRepository {
  static async init(): Promise<User> {
    const user = await UserRepository.find(
      localStorage.getItem(AUTHSECRET("authid"))
    );

    return user;
  }

  static async login(props: LoginParams): Promise<User> {
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

  static async register(props: RegisterParams): Promise<User> {
    const result = await createUserWithEmailAndPassword(
      auth,
      props.email,
      props.password
    );

    const user: User = {
      id: v4(),
      email: result.user!.email ?? props.email,
      name: props.name,
      phone: "",
      verified: false,
      bio: "",
    };

    await UserRepository.save(user);

    localStorage.setItem(AUTHSECRET("authid"), user.id);

    return user;
  }

  static async logout(): Promise<boolean> {
    localStorage.removeItem(AUTHSECRET("authid"));

    return true;
  }
}
