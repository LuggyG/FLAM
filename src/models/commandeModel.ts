import { Collection, ObjectId } from "mongodb";

export type CommandeInput = {
  compte?: {
    e_mail: string;
    adress_livraison?: {
      firstname: string;
      lastname: string;
      numero: string;
      rue: string;
      rue_complement?: string;
      code_postal: string;
      ville: string;
      pays: string;
    };
  };
  panier: {
    game: {
      slug: string;
      name: string;
      pv: number;
      platform?: {
        slug: string;
      };
    };
    qte: number;
  };
  codePromo?: string;
  fraisPort?: number;
  montant: number;
  Paiement: {
    type: string;
  };
};

export type Commande = CommandeInput & {
  _id: ObjectId;
};

export default class CommandeModel {
  private collection: Collection;
  constructor(collection: Collection) {
    this.collection = collection;
  }
}
