import type { DocumentData, DocumentSnapshot } from "firebase/firestore";

export class User {
  id: any;
  email: string;
  name: string;
  phone: string;
  verified: boolean;
  bio?: string;

  static fromDocument(doc: DocumentSnapshot<DocumentData>) {
    const data = doc.data()!;

    return {
      id: doc.id,
      email: data.email ?? "",
      name: data.name ?? "",
      phone: data.phone ?? "",
      verified: data.verified ?? false,
      bio: data.bio ?? "",
    };
  }
}
