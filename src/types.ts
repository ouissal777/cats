export type Breed =
  | "siamois"
  | "persan"
  | "maine-coon"
  | "bengal";

export interface Cat {
  id: number;
  name: string;
  breed: Breed;
  age: number;
  vaccinated: boolean;

 
  [key: string]: string | number | boolean;
}


export enum ToyCategory {
  Balle = "balle",
  Peluche = "peluche",
  Griffoir = "griffoir"
}

export interface Toy {
  id: number;
  name: string;
  category: ToyCategory;
  price: number;
}

export type CatEvent =
  | { type: "cat-played"; catId: number; toyName: string }
  | { type: "birthday"; catId: number; newAge: number }
  | { type: "cat-adopted"; catId: number };


export type ToyOutput<T extends ToyCategory> =
  T extends ToyCategory.Balle ? number :
  T extends ToyCategory.Peluche ? boolean :
  T extends ToyCategory.Griffoir ? string :
  never;


export type ArrayElement<T> =
  T extends (infer Item)[] ? Item : never;


export type NewCat = Omit<Cat, "id">;                       
export type CatSummary = Pick<Cat, "id" | "name" | "breed">;
export type CatUpdate = Partial<Cat>;

export type BallToy = Extract<Toy, { category: ToyCategory.Balle }>;
export type NonGriffoirCategory = Exclude<ToyCategory, ToyCategory.Griffoir>;
export type BreedPoints = Record<Breed, number>;


export type CatPlayedEvent = Extract<CatEvent, { type: "cat-played" }>;
