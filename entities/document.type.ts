import {
  type DocumentData,
  type DocumentSnapshot,
  type Timestamp,
} from "firebase/firestore";
import { User } from "./user.type";

export class Document {
  id: any;
  title: string;
  description?: string;
  cover?: string;
  icon?: string;
  date: Date;
  place: string;
  tags: string[];
  content: string;
  author?: User;

  static fromDocument(doc: DocumentSnapshot<DocumentData>): Document {
    const data = doc.data()!;

    return {
      id: doc.id,
      title: data.title,
      description: data.description ?? "",
      cover: data.cover ?? "",
      icon: data.icon ?? "",
      date: (data.date as Timestamp).toDate(),
      place: data.place ?? "",
      tags: data.tags ?? [],
      content: data.content ?? "",
    };
  }
}
