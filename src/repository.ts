import type { Cat, Toy, NewCat } from "./types";
import { Log, MeasureTime, ValidateToyPrice } from "./decorators";

export class Repository<T extends { id: number }> {
  private items: T[] = [];

  @Log
  add(item: T): void {
    this.items.push(item);
  }

  @MeasureTime
  findById(id: number): T | undefined {
    return this.items.find(item => item.id === id);
  }

  getAll(): T[] {
    return [...this.items];
  }

  update(id: number, changes: Partial<T>): boolean {
    const item = this.findById(id);

    if (!item) return false;

    Object.assign(item, changes);
    return true;
  }
}

export class CatRepository extends Repository<Cat> {

  register(newCat: NewCat): Cat {
    const nextId = Math.max(0, ...this.getAll().map(cat => cat.id)) + 1;
    const cat = { ...newCat, id: nextId } as Cat;
    this.add(cat);
    return cat;
  }


  findByBreed(breed: Cat["breed"]): Cat[] {
    return this.getAll().filter(
      cat => cat.breed === breed
    );
  }
}

export class ToyRepository extends Repository<Toy> {
  @ValidateToyPrice
  override add(toy: Toy): void {
    super.add(toy);
  }
}
