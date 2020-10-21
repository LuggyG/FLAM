import { Collection, ObjectId } from "mongodb";

export type PanierInput = {
  compte?: {
    e_mail: string;
  };
  game?: {
    slug: string;
    name: string;
    pv: number;
    platform?: {
      slug: string;
    };
  };
  qte: number;
};

export type Panier = PanierInput & {
  _id: ObjectId;
};

export default class PanierModel {
  private collection: Collection;
  constructor(collection: Collection) {
    this.collection = collection;
  }
}
