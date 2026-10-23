import {
  ToyCategory,
  type Cat,
  type Toy,
  type CatEvent,
  type Breed,
  type BreedPoints,
  type ToyOutput,
  type ArrayElement,
  type CatSummary,
  type CatUpdate,
  type BallToy,
  type NonGriffoirCategory,
  type CatPlayedEvent,
} from "./types";

import { CatRepository, ToyRepository } from "./repository";
import { Log, Cache } from "./decorators";

const validBreeds: readonly Breed[] = [
  "siamois",
  "persan",
  "maine-coon",
  "bengal"
];

function isBreed(value: unknown): value is Breed {
  return (
    typeof value === "string" &&
    validBreeds.some(breed => breed === value)
  );
}


function isCat(value: unknown): value is Cat {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === "number" &&
    typeof candidate.name === "string" &&
    isBreed(candidate.breed) &&
    typeof candidate.age === "number" &&
    typeof candidate.vaccinated === "boolean"
  );
}

class AcademyService {
  constructor(
    private readonly cats: CatRepository,
    private readonly toys: ToyRepository
  ) {}

  @Log
  playWith(catId: number, toyId: number): string {
    const cat = this.cats.findById(catId);
    const toy = this.toys.findById(toyId);

    if (!cat || !toy) {
      throw new Error("Cat or toy not found");
    }

    return `${cat.name} plays with ${toy.name}!`;
  }

  findByBreed(breed: Breed): CatSummary[] {
    return this.cats
      .getAll()
      .filter(cat => cat.breed === breed)
      .map(({ id, name, breed }) => ({ id, name, breed }));
  }

  updateCat(id: number, changes: CatUpdate): boolean {
    return this.cats.update(id, changes);
  }

  getPlayEvents(events: CatEvent[]): CatPlayedEvent[] {
    return events.filter(
      (event): event is CatPlayedEvent => event.type === "cat-played"
    );
  }
}

const cats = new CatRepository();
const toys = new ToyRepository();

cats.add({
  id: 1,
  name: "Felix",
  breed: "siamois",
  age: 3,
  vaccinated: true,
  color: "crème"
});

cats.add({
  id: 2,
  name: "Luna",
  breed: "persan",
  age: 5,
  vaccinated: true
});

cats.add({
  id: 3,
  name: "Milo",
  breed: "bengal",
  age: 2,
  vaccinated: false
});

toys.add({
  id: 101,
  name: "Balle à clochette",
  category: ToyCategory.Balle,
  price: 4
});

toys.add({
  id: 102,
  name: "Souris en peluche",
  category: ToyCategory.Peluche,
  price: 6
});

const academy = new AcademyService(cats, toys);

console.log("\n Play with a toy ");
console.log(academy.playWith(1, 101));

console.log("\n Find cats by breed ");
console.log(academy.findByBreed("siamois"));

console.log("\n Update a cat ");
academy.updateCat(1, { age: 4 });
console.log(cats.findById(1));

console.log("\n Type guard ");
const unknownCat: unknown = cats.findById(1);
if (isCat(unknownCat)) {
  console.log(`${unknownCat.name} is a ${unknownCat.breed}`);
}

console.log("\n Record utility type ");
const points: BreedPoints = {
  siamois: 100,
  persan: 80,
  "maine-coon": 90,
  bengal: 70
};
console.log(points);

console.log("\n Extract cat-played events ");
const events: CatEvent[] = [
  { type: "cat-played", catId: 1, toyName: "Balle à clochette" },
  { type: "birthday", catId: 2, newAge: 6 },
  { type: "cat-adopted", catId: 3 }
];
console.log(academy.getPlayEvents(events));



console.log("\n Exercice 1 : ");
const newCat = cats.register({
  name: "Simba",
  breed: "maine-coon",
  age: 1,
  vaccinated: false
});
console.log(newCat);

console.log("\n Exercice 2 : ");
console.log(cats.findByBreed("siamois"));


console.log("\n Exercice 3 :");
function handleCatPlayed(event: CatPlayedEvent): void {
  console.log(
    `Cat ${event.catId} played with ${event.toyName}`
  );
}

handleCatPlayed({
  type: "cat-played",
  catId: 1,
  toyName: "Balle à clochette"
});

console.log("\nExercice 4 : ");
toys.add({
  id: 103,
  name: "Griffoir tour",
  category: ToyCategory.Griffoir,
  price: 25
});

try {
  toys.add({
    id: 104,
    name: "Invalid Toy",
    category: ToyCategory.Peluche,
    price: -10
  });
} catch (e) {
  console.log((e as Error).message);
}

console.log("\nExercice 5 :");
class FoodCalculator {
  @Cache
  dailyGrams(weightKg: number, factor: number): number {
    console.log("Calculating...");

    return weightKg * factor;
  }
}

const calculator = new FoodCalculator();

console.log(calculator.dailyGrams(4, 15));
console.log(calculator.dailyGrams(4, 15));
console.log(calculator.dailyGrams(5, 12));

console.log("\nExercice 6 : ");
const validData: unknown = {
  id: 1,
  name: "Felix",
  breed: "siamois",
  age: 3,
  vaccinated: true
};

const invalidData: unknown = {
  id: 2,
  name: "Rex",
  breed: "chartreux",
  age: 5,
  vaccinated: true
};

console.log(isCat(validData));   // true
console.log(isCat(invalidData)); // false


type PlayArguments = Parameters<AcademyService["playWith"]>;
type PlayResult = ReturnType<AcademyService["playWith"]>;
type BallOutput = ToyOutput<ToyCategory.Balle>; // number
type GriffoirOutput = ToyOutput<ToyCategory.Griffoir>; // string
type ToyItem = ArrayElement<Toy[]>; // Toy
type BallToyExample = BallToy;
type RemainingCategories = NonGriffoirCategory;

const typeExamples: [
  PlayArguments,
  PlayResult,
  BallOutput,
  GriffoirOutput,
  ToyItem,
  BallToyExample["category"],
  RemainingCategories
] | null = null;

void typeExamples;
