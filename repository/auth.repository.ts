import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
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
  static getToken() {
    return localStorage.getItem(AUTHSECRET("authid"));
  }

  static setToken(token: string) {
    localStorage.setItem(AUTHSECRET("authid"), token);
  }

  static async init(): Promise<User> {
    const user = await UserRepository.find(this.getToken());

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

    this.setToken(user.id);

    return user;
  }

  static async loginByGoogle() {
    const provider = new GoogleAuthProvider();
    provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
    provider.addScope("https://www.googleapis.com/auth/userinfo.email");

    const result = await signInWithPopup(auth, provider);

    if (result.user.email) {
      let user: User;

      try {
        user = await UserRepository.getByEmail(result.user.email);
      } catch (e) {
        const id = v4();
        user = {
          id,
          email: result.user.email!,
          name: result.user.displayName ?? result.user.email!,
          phone: result.user.phoneNumber ?? "",
          verified: false,
          bio: "",
        };

        await UserRepository.save(user);
      }

      this.setToken(user.id);
      return user;
    }
  }

  static async register(props: RegisterParams): Promise<User> {
    await createUserWithEmailAndPassword(auth, props.email, props.password);

    const user: User = {
      id: v4(),
      email: props.email,
      name: props.name,
      phone: "",
      verified: false,
      bio: "",
    };

    await UserRepository.save(user);

    this.setToken(user.id);

    return user;
  }

  static async logout(): Promise<boolean> {
    await auth.signOut();
    localStorage.removeItem(AUTHSECRET("authid"));

    return true;
  }
}
