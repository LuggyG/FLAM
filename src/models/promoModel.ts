import { Collection, ObjectId } from "mongodb";

export type PromoInput = {
  code: string;
  remise: number;
  date_deb_valid: Date;
  date_fin_valid: Date;
};

export type Promo = PromoInput & {
  _id: ObjectId;
};

export default class PanierModel {
  private collection: Collection;
  constructor(collection: Collection) {
    this.collection = collection;
  }

  findAll(): Promise<Promo[]> {
    return this.collection.find({}).toArray();
  }

  findByCode(code: string): Promise<Promo | null> {
    return this.collection.findOne({
      code: code,
    });
  }
}
